import Inner from 'components/Inner/Inner';
import { COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueRubric } from 'lib/catalogueUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ShopProductsListRouteInterface {
  shop: ShopModel;
}

const ShopProductsListRoute: React.FC<ShopProductsListRouteInterface> = ({ shop }) => {
  return (
    <AppShopLayout shop={shop}>
      <Inner>products</Inner>
    </AppShopLayout>
  );
};

interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    ShopProductsListRouteInterface {}

const CompanyShopProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
}) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopProductsListRoute shop={shop} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsListInterface>> => {
  const db = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const { query } = context;
  const { shopId, filter } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context });

  // Get shop
  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });
  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  // Get rubric
  const rubric = await getCatalogueRubric([
    {
      $match: { _id: new ObjectId(rubricId) },
    },
  ]);
  if (!rubric) {
    return {
      notFound: true,
    };
  }

  // Cast filters
  const {
    minPrice,
    maxPrice,
    realFilterOptions,
    sortBy,
    sortDir,
    sortFilterOptions,
    noFiltersSelected,
    castedFilters,
    page,
    skip,
    limit,
  } = castCatalogueFilters(restFilter);

  console.log({
    sortBy,
    sortDir,
    sortFilterOptions,
    castedFilters,
    page,
    skip,
    limit,
  });

  // Product stages
  const pricesStage =
    minPrice && maxPrice
      ? {
          price: {
            $gte: minPrice,
            $lte: maxPrice,
          },
        }
      : {};

  const optionsStage = noFiltersSelected
    ? {}
    : {
        selectedOptionsSlugs: {
          $all: realFilterOptions,
        },
      };

  const shopProductsAggregation = await shopProductsCollection
    .aggregate([
      {
        $match: {
          rubricId: rubric._id,
          shopId: shop._id,
          ...pricesStage,
          ...optionsStage,
        },
      },
    ])
    .toArray();

  console.log(shopProductsAggregation.length);

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopProductsList;
