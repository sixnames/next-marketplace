import * as React from 'react';
import ShopAssets from 'routes/Shop/ShopAssets';
import DataLayout from '../../components/DataLayout/DataLayout';
import useTabsConfig from '../../hooks/useTabsConfig';
import { useGetShopQuery } from 'generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import TabsContent from '../../components/TabsContent/TabsContent';
import ShopDetails from './ShopDetails';
import ShopProducts from './ShopProducts';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { useRouter } from 'next/router';
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

export default ShopRoute;
