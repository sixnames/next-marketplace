import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_APP } from 'config/common';
import { ShopModel } from 'db/dbModels';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

interface AppShopLayoutInterface {
  shop: ShopModel;
}

const AppShopLayout: React.FC<AppShopLayoutInterface> = ({ shop, children }) => {
  const router = useRouter();
  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Детали',
        testId: 'details',
        path: `${ROUTE_APP}/${router.query.companyId}/shops/${shop._id}`,
        exact: true,
      },
      {
        name: 'Товары',
        testId: 'products',
        path: `${ROUTE_APP}/${router.query.companyId}/shops/${shop._id}/products`,
      },
      {
        name: 'Изображения',
        testId: 'assets',
        path: `${ROUTE_APP}/${router.query.companyId}/shops/${shop._id}/assets`,
        exact: true,
      },
    ];
  }, [router.query.companyId, shop._id]);

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
