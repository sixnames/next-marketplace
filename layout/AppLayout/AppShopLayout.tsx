import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ShopInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';

export interface AppShopLayoutInterface {
  shop: ShopInterface;
  basePath: string;
}

const AppShopLayout: React.FC<AppShopLayoutInterface> = ({ shop, basePath, children }) => {
  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Детали',
        testId: 'shop-details',
        path: `${basePath}/${shop._id}`,
        exact: true,
      },
      {
        name: 'Заказы',
        testId: 'shop-orders',
        path: `${basePath}/${shop._id}/orders`,
      },
      {
        name: 'Товары',
        testId: 'shop-products',
        path: `${basePath}/${shop._id}/products`,
      },
      {
        name: 'Изображения',
        testId: 'shop-assets',
        path: `${basePath}/${shop._id}/assets`,
        exact: true,
      },
    ];
  }, [basePath, shop._id]);

  return (
    <AppContentWrapper>
      <Head>
        <title>{`Магазин ${shop.name}`}</title>
      </Head>

      <Inner lowBottom>
        <Title>Магазин {shop.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default AppShopLayout;
