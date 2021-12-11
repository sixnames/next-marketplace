import { ROUTE_CONSOLE } from 'config/common';
import { COL_PROMO_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import { castRubricForUI } from 'db/dao/rubrics/castRubricForUI';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, PromoInterface, RubricInterface } from 'db/uiInterfaces';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import CompanyRubricsList, { CompanyRubricsListInterface } from 'layout/CompanyRubricsList';
import ConsolePromoLayout from 'layout/console/ConsolePromoLayout';
import { getPromoSsr } from 'lib/promoUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface ConsolePromoRubricsInterface extends CompanyRubricsListInterface {
  promo: PromoInterface;
}

const ConsolePromoRubrics: React.FC<ConsolePromoRubricsInterface> = ({
  pageCompany,
  promo,
  routeBasePath,
  rubrics,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: 'Акции',
        href: `${ROUTE_CONSOLE}/${pageCompany._id}/promo`,
      },
      {
        name: `${promo.name}`,
        href: `${ROUTE_CONSOLE}/${pageCompany._id}/promo/details/${promo._id}`,
      },
    ],
  };

  return (
    <ConsolePromoLayout basePath={routeBasePath} promo={promo} breadcrumbs={breadcrumbs}>
      <CompanyRubricsList
        rubrics={rubrics}
        pageCompany={pageCompany}
        routeBasePath={`${routeBasePath}/rubrics`}
      />
    </ConsolePromoLayout>
  );
};

interface PromoDetailsPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ConsolePromoRubricsInterface {}

const PromoDetailsPage: React.FC<PromoDetailsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout title={`${props.promo.name}`} {...layoutProps}>
      <ConsolePromoRubrics {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.promoId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const promo = await getPromoSsr({
    locale: props.sessionLocale,
    promoId: `${query.promoId}`,
  });
  if (!promo) {
    return {
      notFound: true,
    };
  }

  // get rubrics
  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $project: {
          attributes: false,
          catalogueTitle: false,
          descriptionI18n: false,
          shortDescriptionI18n: false,
          priorities: false,
          views: false,
        },
      },
      {
        $lookup: {
          from: COL_PROMO_PRODUCTS,
          as: 'promoProducts',
          let: { rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                promoId: promo._id,
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
              },
            },
            {
              $count: 'totalDocs',
            },
          ],
        },
      },
      {
        $addFields: {
          totalShopProductsObject: { $arrayElemAt: ['$promoProducts', 0] },
        },
      },
      {
        $addFields: {
          productsCount: '$totalShopProductsObject.totalDocs',
        },
      },
      {
        $project: {
          promoProducts: false,
          totalShopProductsObject: false,
        },
      },
    ])
    .toArray();

  const rawRubrics = initialRubrics.map((rubric) => {
    return castRubricForUI({ rubric, locale: props.sessionLocale });
  });

  return {
    props: {
      ...props,
      routeBasePath: `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}/promo/details/${promo._id}`,
      pageCompany: castDbData(props.layoutProps.pageCompany),
      promo: castDbData(promo),
      rubrics: castDbData(rawRubrics),
    },
  };
};

export default PromoDetailsPage;
