import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import TabsContent from 'components/TabsContent/TabsContent';
import { useGetShopQuery } from 'generated/apolloComponents';
import useTabsConfig from 'hooks/useTabsConfig';
import { useRouter } from 'next/router';
import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import ShopAssets from 'routes/Shop/ShopAssets';
import ShopDetails from 'routes/Shop/ShopDetails';
import ShopProducts from 'routes/Shop/ShopProducts';
import { NavItemInterface } from 'types/clientTypes';

const ShopRoute: React.FC = () => {
  const { query } = useRouter();
  const { shopId } = query;
  const { generateTabsConfig } = useTabsConfig();
  const { data, loading, error } = useGetShopQuery({
    fetchPolicy: 'network-only',
    skip: !shopId,
    variables: {
      _id: `${shopId}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getShop) {
    return <RequestError />;
  }

  const shop = data.getShop;

  // Shop nav tabs config
  const navConfig: NavItemInterface[] = generateTabsConfig({
    config: [
      {
        name: 'Детали',
        testId: 'details',
      },
      {
        name: 'Товары',
        testId: 'products',
      },
      {
        name: 'Изображения',
        testId: 'assets',
      },
    ],
  });

  return (
    <DataLayout
      title={shop.name}
      filterResultNavConfig={navConfig}
      filterResult={() => (
        <DataLayoutContentFrame>
          <TabsContent>
            <ShopDetails shop={shop} />
            <ShopProducts />
            <ShopAssets shop={shop} />
          </TabsContent>
        </DataLayoutContentFrame>
      )}
    />
  );
};

const Shop: NextPage = () => {
  return (
    <AppLayout>
      <ShopRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Shop;
