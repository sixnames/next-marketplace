import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_RUBRICS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { RubricModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getI18nLocaleValue } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import ShopRubrics, { ShopRubricsInterface } from 'components/shops/ShopRubrics';

interface CompanyShopProductsInterface
  extends PagePropsInterface,
    Omit<ShopRubricsInterface, 'basePath'> {}

const CompanyShopProducts: NextPage<CompanyShopProductsInterface> = ({
  pageUrls,
  rubrics,
  shop,
}) => {
  const companyBasePath = `${ROUTE_CMS}/companies/${shop.companyId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Товары',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${shop.company?.name}`,
        href: companyBasePath,
      },
      {
        name: 'Магазины',
        href: `${companyBasePath}/shops/${shop.companyId}`,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shops/shop/${shop._id}`,
      },
    ],
  };

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopRubrics
        shop={shop}
        rubrics={rubrics}
        basePath={`${companyBasePath}/shops/shop`}
        breadcrumbs={breadcrumbs}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shopAggregation = await shopsCollection
    .aggregate([
      {
        $match: { _id: new ObjectId(`${shopId}`) },
      },
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'company',
          foreignField: '_id',
          localField: 'companyId',
        },
      },
      {
        $addFields: {
          company: {
            $arrayElemAt: ['$company', 0],
          },
        },
      },
    ])
    .toArray();
  const shop = shopAggregation[0];

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  const shopRubricsAggregation = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $project: {
          _id: true,
          nameI18n: true,
          slug: true,
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
                shopId: shop._id,
                $expr: {
                  $eq: ['$rubricId', '$$rubricId'],
                },
              },
            },
            {
              $project: {
                _id: true,
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $addFields: {
          rubric: { $arrayElemAt: ['$rubrics', 0] },
        },
      },
      {
        $addFields: {
          productsCountObject: { $arrayElemAt: ['$shopProducts', 0] },
        },
      },
      {
        $addFields: {
          productsCount: '$productsCountObject.count',
        },
      },
      {
        $project: {
          _id: true,
          nameI18n: true,
          slug: true,
          productsCount: true,
        },
      },
    ])
    .toArray();

  const castedShopRubrics = shopRubricsAggregation.map((rubric) => {
    return {
      ...rubric,
      name: getI18nLocaleValue<string>(rubric.nameI18n, `${initialProps.props?.sessionLocale}`),
      productsCount: noNaN(rubric.productsCount),
    };
  });

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
      rubrics: castDbData(castedShopRubrics),
    },
  };
};

export default CompanyShopProducts;
