import Inner from 'components/Inner';
import Title from 'components/Title';
import { PromoInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface ConsolePromoLayoutInterface {
  promo: PromoInterface;
  basePath: string;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const ConsolePromoLayout: React.FC<ConsolePromoLayoutInterface> = ({
  basePath,
  promo,
  children,
  breadcrumbs,
}) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'promo-details',
        path: `${basePath}`,
        exact: true,
      },
      {
        name: 'Товары',
        testId: 'promo-products',
        path: `${basePath}/products`,
      },
    ];
  }, [basePath]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{promo.name}</title>
      </Head>
      <Inner lowBottom>
        <Title tag={'div'}>{promo.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsolePromoLayout;
