import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ShopRubrics, {
  ShopRubricsInterface,
} from '../../../../../../../components/shops/ShopRubrics';
import { COL_RUBRICS, COL_SHOP_PRODUCTS, COL_SHOPS } from '../../../../../../../db/collectionNames';
import { RubricModel, ShopModel } from '../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  RubricInterface,
} from '../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getI18nLocaleValue } from '../../../../../../../lib/i18n';
import { getConsoleCompanyLinks } from '../../../../../../../lib/linkUtils';
import { noNaN } from '../../../../../../../lib/numbers';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface CompanyShopProductsInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<ShopRubricsInterface, 'basePath'> {}

const CompanyShopProducts: NextPage<CompanyShopProductsInterface> = ({
  layoutProps,
  rubrics,
  shop,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Товары',
    config: [
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopRubrics
        shop={shop}
        rubrics={rubrics}
        basePath={links.parentLink}
        breadcrumbs={breadcrumbs}
      />
    </ConsoleLayout>
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
  const initialProps = await getConsoleInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });

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
