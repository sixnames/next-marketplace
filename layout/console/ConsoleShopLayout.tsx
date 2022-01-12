import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { ConsoleShopLayoutInterface } from '../../db/uiInterfaces';
import { getCmsCompanyLinks } from '../../lib/linkUtils';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

const ConsoleShopLayout: React.FC<ConsoleShopLayoutInterface> = ({
  shop,
  breadcrumbs,
  basePath,
  children,
}) => {
  const navConfig = React.useMemo(() => {
    const links = getCmsCompanyLinks({
      basePath,
      shopId: shop._id,
      companyId: shop.companyId,
    });

    return [
      {
        name: 'Детали',
        testId: 'shop-details',
        path: links.shop.root,
        exact: true,
      },
      {
        name: 'Заказы',
        testId: 'shop-orders',
        path: links.shop.order.parentLink,
      },
      {
        name: 'Товары',
        testId: 'shop-products',
        path: links.shop.rubrics.parentLink,
      },
      {
        name: 'Изображения',
        testId: 'shop-assets',
        path: links.shop.assets,
        exact: true,
      },
      {
        name: 'Ошибки синхронизации',
        testId: 'shop-sync-errors',
        path: links.shop.syncErrors,
      },
    ];
  }, [basePath, shop]);

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
