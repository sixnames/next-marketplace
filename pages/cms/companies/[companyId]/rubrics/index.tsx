import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import {
  COL_COMPANIES,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../../../../db/collectionNames';
import { castRubricForUI } from '../../../../../db/dao/rubrics/castRubricForUI';
import { RubricModel } from '../../../../../db/dbModels';
import { getDatabase } from '../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  RubricInterface,
} from '../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../layout/cms/CmsCompanyLayout';
import CompanyRubricsList, {
  CompanyRubricsListInterface,
} from '../../../../../layout/CompanyRubricsList';
import { getConsoleCompanyLinks } from '../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';

interface RubricsRouteInterface extends CompanyRubricsListInterface {}

const RubricsRoute: React.FC<RubricsRouteInterface> = ({ rubrics, pageCompany, routeBasePath }) => {
  const { root, parentLink } = getConsoleCompanyLinks({
    companyId: pageCompany._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Рубрикатор',
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: root,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <CompanyRubricsList
        rubrics={rubrics}
        pageCompany={pageCompany}
        routeBasePath={routeBasePath}
      />
    </CmsCompanyLayout>
  );
};

interface RubricsInterface extends GetAppInitialDataPropsInterface, RubricsRouteInterface {}

const Rubrics: NextPage<RubricsInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricsRoute {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricsInterface>> => {
  const { db } = await getDatabase();
  const { query } = context;
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
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
          from: COL_RUBRIC_VARIANTS,
          as: 'variants',
          localField: 'variantId',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          variant: { $arrayElemAt: ['$variants', 0] },
        },
      },
      {
        $lookup: {
          from: COL_SHOP_PRODUCTS,
          as: 'shopProducts',
          let: { rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
                companyId,
              },
            },
            {
              $group: {
                _id: '$productId',
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
          totalShopProductsObject: { $arrayElemAt: ['$shopProducts', 0] },
        },
      },
      {
        $addFields: {
          productsCount: '$totalShopProductsObject.totalDocs',
        },
      },
      {
        $project: {
          variants: false,
          shopProducts: false,
          totalShopProductsObject: false,
        },
      },
      {
        $match: {
          productsCount: {
            $gt: 0,
          },
        },
      },
    ])
    .toArray();

  const rawRubrics = initialRubrics.map((rubric) => {
    return castRubricForUI({ rubric, locale: props.sessionLocale });
  });

  const links = getConsoleCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      rubrics: castDbData(rawRubrics),
      pageCompany: castDbData(companyResult),
      routeBasePath: links.rubrics.parentLink,
    },
  };
};

export default Rubrics;
