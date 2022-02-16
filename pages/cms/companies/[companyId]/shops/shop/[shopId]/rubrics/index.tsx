import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopRubrics, { ShopRubricsInterface } from 'components/shops/ShopRubrics';
import { COL_COMPANIES, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, RubricInterface } from 'db/uiInterfaces';
import { getI18nLocaleValue } from 'lib/i18n';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CompanyShopProductsInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopRubricsInterface, 'basePath'> {}

const CompanyShopProducts: NextPage<CompanyShopProductsInterface> = ({
  layoutProps,
  rubrics,
  shop,
}) => {
  const links = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Товары',
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${shop.company?.name}`,
        href: links.root,
      },
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
      <ShopRubrics shop={shop} rubrics={rubrics} breadcrumbs={breadcrumbs} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsInterface>> => {
  const collections = await getDbCollections();
  const shopsCollection = collections.shopsCollection();
  const rubricsCollection = collections.rubricsCollection();
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
