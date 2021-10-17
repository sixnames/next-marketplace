import Inner from 'components/Inner';
import Title from 'components/Title';
import { PromoInterface } from 'db/uiInterfaces';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface ConsolePromoLayoutInterface {
  promo: PromoInterface;
  basePath: string;
}

const ConsolePromoLayout: React.FC<ConsolePromoLayoutInterface> = ({
  basePath,
  promo,
  children,
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
    <div>
      <Head>
        <title>{promo.name}</title>
      </Head>
      <Inner lowBottom>
        <Title size={'small'} tag={'h2'}>
          {promo.name}
        </Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </div>
  );
};

export default ConsolePromoLayout;
