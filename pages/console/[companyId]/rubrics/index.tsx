import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../components/Inner';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_CONSOLE } from '../../../../config/common';
import {
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../../../db/collectionNames';
import { RubricModel } from '../../../../db/dbModels';
import { getDatabase } from '../../../../db/mongodb';
import { RubricInterface } from '../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import CompanyRubricsList, {
  CompanyRubricsListInterface,
} from '../../../../layout/CompanyRubricsList';
import { getFieldStringLocale } from '../../../../lib/i18n';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';

interface RubricsRouteInterface extends CompanyRubricsListInterface {}
const pageTitle = 'Рубрикатор';

const RubricsRoute: React.FC<RubricsRouteInterface> = ({ rubrics, pageCompany, routeBasePath }) => {
  return (
    <AppContentWrapper>
      <Inner lowBottom>
        <WpTitle>{pageTitle}</WpTitle>
      </Inner>
      <CompanyRubricsList
        rubrics={rubrics}
        pageCompany={pageCompany}
        routeBasePath={routeBasePath}
      />
    </AppContentWrapper>
  );
};

interface RubricsInterface extends GetConsoleInitialDataPropsInterface, RubricsRouteInterface {}

const Rubrics: NextPage<RubricsInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
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
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }
  const companyId = new ObjectId(`${query.companyId}`);

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

  const { sessionLocale } = props;
  const rawRubrics = initialRubrics.map(({ nameI18n, ...rubric }) => {
    return {
      ...rubric,
      name: getFieldStringLocale(nameI18n, sessionLocale),
      variant: rubric.variant
        ? {
            ...rubric.variant,
            name: getFieldStringLocale(rubric.variant.nameI18n, sessionLocale),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      rubrics: castDbData(rawRubrics),
      routeBasePath: `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}/rubrics`,
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default Rubrics;
