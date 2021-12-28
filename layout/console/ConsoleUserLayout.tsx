import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { AppContentWrapperBreadCrumbs, UserInterface } from '../../db/uiInterfaces';
import { getConsoleCompanyLinks } from '../../lib/linkUtils';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

interface ConsoleUserLayoutInterface {
  user: UserInterface;
  companyId: string;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const ConsoleUserLayout: React.FC<ConsoleUserLayoutInterface> = ({
  user,
  children,
  breadcrumbs,
  companyId,
}) => {
  const navConfig = React.useMemo(() => {
    const { customer } = getConsoleCompanyLinks({
      companyId: companyId,
      userId: user._id,
    });

    return [
      {
        name: 'Детали',
        testId: 'user-details',
        path: customer.root,
        exact: true,
      },
      {
        name: 'Заказы',
        testId: 'user-orders',
        path: customer.order.parentLink,
      },
    ];
  }, [companyId, user._id]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{user.fullName}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle
          subtitle={
            <div className='flex'>
              <div>{`ID ${user.itemId}`}</div>
              <div className='ml-4'>{user.category?.name}</div>
            </div>
          }
          testId={`${user.itemId}-user-title`}
        >
          {user.fullName}
        </WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleUserLayout;
