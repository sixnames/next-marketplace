import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import CompanyRubricsList, {
  CompanyRubricsListInterface,
} from 'components/layout/CompanyRubricsList';
import ConsolePromoLayout from 'components/layout/console/ConsolePromoLayout';
import { castRubricForUI } from 'db/cast/castRubricForUI';
import { COL_PROMO_PRODUCTS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, PromoInterface, RubricInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { getPromoSsr } from 'lib/promoUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface ConsolePromoRubricsInterface extends Omit<CompanyRubricsListInterface, 'routeBasePath'> {
  promo: PromoInterface;
}

const ConsolePromoRubrics: React.FC<ConsolePromoRubricsInterface> = ({
  pageCompany,
  promo,
  rubrics,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    promoId: promo._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: 'Акции',
        href: links.console.companyId.promo.url,
      },
      {
        name: `${promo.name}`,
        href: links.console.companyId.promo.details.promoId.url,
      },
    ],
  };

  return (
    <ConsolePromoLayout promo={promo} breadcrumbs={breadcrumbs}>
      <CompanyRubricsList rubrics={rubrics} pageCompany={pageCompany} />
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

  const collections = await getDbCollections();
  const rubricsCollection = collections.rubricsCollection();

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
      pageCompany: castDbData(props.layoutProps.pageCompany),
      promo: castDbData(promo),
      rubrics: castDbData(rawRubrics),
    },
  };
};

export default PromoDetailsPage;
