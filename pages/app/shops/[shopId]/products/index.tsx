import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import useShopAppNav from 'hooks/useShopAppNav';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ShopProductsRouteInterface {
  shop: ShopModel;
}

const ShopProductsRoute: React.FC<ShopProductsRouteInterface> = ({ shop }) => {
  const navConfig = useShopAppNav({ shopId: `${shop._id}` });

  return (
    <div className={'pt-11'}>
      <Head>
        <title>{`Магазин ${shop.name}`}</title>
      </Head>

      <Inner lowBottom>
        <Title>Магазин {shop.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>Products</Inner>
    </div>
  );
};

interface CompanyShopProductsInterface extends PagePropsInterface, ShopProductsRouteInterface {}

const CompanyShopProducts: NextPage<CompanyShopProductsInterface> = ({ pageUrls, shop }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopProductsRoute shop={shop} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsInterface>> => {
  const db = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShopProducts;
