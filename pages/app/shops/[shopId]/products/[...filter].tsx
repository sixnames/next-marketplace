import Inner from 'components/Inner/Inner';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
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
  const { query } = context;
  const { shopId, filter } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  const {
    minPrice,
    maxPrice,
    realFilterOptions,
    sortBy,
    sortDir,
    sortFilterOptions,
    noFiltersSelected,
    castedFilters,
  } = castCatalogueFilters(restFilter);

  console.log({
    rubricId,
    sortBy,
    sortDir,
    sortFilterOptions,
    castedFilters,
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

  const productsInitialMatch = {
    rubricId: rubricId,
    ...pricesStage,
  };

  console.log({ optionsStage, productsInitialMatch });

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopProductsList;
