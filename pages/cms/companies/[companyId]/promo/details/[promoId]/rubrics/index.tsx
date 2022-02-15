import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import { COL_COMPANIES, COL_PROMO_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import { castRubricForUI } from 'db/cast/castRubricForUI';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  PromoInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import CompanyRubricsList, { CompanyRubricsListInterface } from 'components/layout/CompanyRubricsList';
import ConsolePromoLayout from 'components/layout/console/ConsolePromoLayout';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { getPromoSsr } from 'lib/promoUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ConsolePromoRubricsInterface extends Omit<CompanyRubricsListInterface, 'routeBasePath'> {
  promo: PromoInterface;
}

const ConsolePromoRubrics: React.FC<ConsolePromoRubricsInterface> = ({
  pageCompany,
  promo,
  rubrics,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: pageCompany.name,
        href: links.root,
      },
      {
        name: 'Акции',
        href: links.promo.parentLink,
      },
      {
        name: `${promo.name}`,
        href: links.promo.root,
      },
    ],
  };

  return (
    <ConsolePromoLayout promo={promo} breadcrumbs={breadcrumbs}>
      <CompanyRubricsList
        rubrics={rubrics}
        pageCompany={pageCompany}
        routeBasePath={links.promo.root}
      />
    </ConsolePromoLayout>
  );
};

interface PromoDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
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
  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId || !query.promoId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const company = await companiesCollection.findOne({
    _id: new ObjectId(`${query.companyId}`),
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

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
      pageCompany: castDbData(company),
      promo: castDbData(promo),
      rubrics: castDbData(rawRubrics),
    },
  };
};

export default PromoDetailsPage;
