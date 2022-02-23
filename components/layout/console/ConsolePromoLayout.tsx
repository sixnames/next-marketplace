import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, PromoInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';

import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface ConsolePromoLayoutInterface {
  promo: PromoInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const ConsolePromoLayout: React.FC<ConsolePromoLayoutInterface> = ({
  promo,
  children,
  breadcrumbs,
}) => {
  const basePath = useBasePath('promoId');

  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'promo-details',
      path: basePath,
      exact: true,
    },
    {
      name: 'Товары',
      testId: 'promo-products',
      path: `${basePath}/rubrics`,
    },
    {
      name: 'Промо-коды',
      testId: 'promo-codes',
      path: `${basePath}/code`,
    },
  ];

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{promo.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle tag={'div'}>{promo.name}</WpTitle>
        <div className='space-y-2 text-secondary-text'>
          <div className='flex items-baseline gap-2'>
            <div>Начало:</div>
            <FormattedDateTime value={promo.startAt} />
          </div>
          <div className='flex items-baseline gap-2'>
            <div>Окончание:</div>
            <FormattedDateTime value={promo.endAt} />
          </div>
        </div>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsolePromoLayout;
