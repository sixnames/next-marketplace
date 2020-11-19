import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import useTabsConfig from '../../hooks/useTabsConfig';
import { useGetShopQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import { NavItemInterface } from '../../types';
import TabsContent from '../../components/TabsContent/TabsContent';
import ShopDetails from './ShopDetails';
import ShopProducts from './ShopProducts';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { useRouter } from 'next/router';

const ShopRoute: React.FC = () => {
  const { query } = useRouter();
  const { shopId } = query;
  const { generateTabsConfig } = useTabsConfig();
  const { data, loading, error } = useGetShopQuery({
    fetchPolicy: 'network-only',
    skip: !shopId,
    variables: {
      id: `${shopId}`,
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
    ],
  });

  return (
    <DataLayout
      title={shop.nameString}
      filterResultNavConfig={navConfig}
      filterResult={() => (
        <DataLayoutContentFrame>
          <TabsContent>
            <ShopDetails shop={shop} />
            <ShopProducts />
          </TabsContent>
        </DataLayoutContentFrame>
      )}
    />
  );
};

export default ShopRoute;
