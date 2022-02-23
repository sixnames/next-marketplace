import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { ConsoleShopLayoutInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';

import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

const ConsoleShopLayout: React.FC<ConsoleShopLayoutInterface> = ({
  shop,
  breadcrumbs,
  children,
}) => {
  const basePath = useBasePath('shopId');

  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'shop-details',
      path: basePath,
      exact: true,
    },
    {
      name: 'Заказы',
      testId: 'shop-orders',
      path: `${basePath}/shop-orders`,
    },
    {
      name: 'Товары',
      testId: 'shop-products',
      path: `${basePath}/rubrics`,
    },
    {
      name: 'Изображения',
      testId: 'shop-assets',
      path: `${basePath}/assets`,
      exact: true,
    },
    {
      name: 'Ошибки синхронизации',
      testId: 'shop-sync-errors',
      path: `${basePath}/sync-errors`,
    },
  ];

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{`${shop.name}`}</title>
      </Head>

      <Inner lowBottom>
        <WpTitle>Магазин {shop.name}</WpTitle>
        {shop.lastSyncLog ? (
          <div>
            Последняя синхронизация <FormattedDateTime value={shop.lastSyncLog.createdAt} />
          </div>
        ) : null}
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleShopLayout;
