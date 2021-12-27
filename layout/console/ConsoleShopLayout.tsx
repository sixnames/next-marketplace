import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { ConsoleShopLayoutInterface } from '../../db/uiInterfaces';
import { getShopCompanyLinks } from '../../lib/linkUtils';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

const ConsoleShopLayout: React.FC<ConsoleShopLayoutInterface> = ({
  shop,
  breadcrumbs,
  basePath,
  children,
}) => {
  const navConfig = React.useMemo(() => {
    const { root, orders, products, assets, syncErrors } = getShopCompanyLinks({
      basePath,
      shopId: shop._id,
    });
    return [
      {
        name: 'Детали',
        testId: 'shop-details',
        path: root,
        exact: true,
      },
      {
        name: 'Заказы',
        testId: 'shop-orders',
        path: orders,
      },
      {
        name: 'Товары',
        testId: 'shop-products',
        path: products.root,
      },
      {
        name: 'Изображения',
        testId: 'shop-assets',
        path: assets,
        exact: true,
      },
      {
        name: 'Ошибки синхронизации',
        testId: 'shop-sync-errors',
        path: syncErrors,
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
