import Head from 'next/head';
import * as React from 'react';
import FormattedDateTime from '../../components/FormattedDateTime';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { AppContentWrapperBreadCrumbs, PromoInterface } from '../../db/uiInterfaces';
import { ClientNavItemInterface } from '../../types/clientTypes';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

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
        path: `${basePath}/rubrics`,
      },
    ];
  }, [basePath]);

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
