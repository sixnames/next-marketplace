import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { ConsoleShopLayoutInterface } from '../../db/uiInterfaces';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

const ConsoleShopLayout: React.FC<ConsoleShopLayoutInterface> = ({
  shop,
  breadcrumbs,
  basePath,
  children,
}) => {
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
        path: `${basePath}/${shop._id}/shop-orders`,
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
      {
        name: 'Ошибки синхронизации',
        testId: 'shop-sync-errors',
        path: `${basePath}/${shop._id}/sync-errors`,
      },
    ];
  }, [basePath, shop._id]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{`Магазин ${shop.name}`}</title>
      </Head>

      <Inner lowBottom>
        <WpTitle>Магазин {shop.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleShopLayout;
