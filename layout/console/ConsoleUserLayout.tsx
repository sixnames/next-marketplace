import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { AppContentWrapperBreadCrumbs, UserInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';

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
    return [
      {
        name: 'Детали',
        testId: 'user-details',
        path: `${ROUTE_CONSOLE}/${companyId}/customers/user/${user._id}`,
        exact: true,
      },
      {
        name: 'Заказы',
        testId: 'user-orders',
        path: `${ROUTE_CONSOLE}/${companyId}/customers/user/${user._id}/orders`,
      },
    ];
  }, [companyId, user._id]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{user.fullName}</title>
      </Head>
      <Inner lowBottom>
        <Title
          subtitle={
            <div className='flex'>
              <div>{`ID ${user.itemId}`}</div>
              <div className='ml-4'>{user.category?.name}</div>
            </div>
          }
          testId={`${user.itemId}-user-title`}
        >
          {user.fullName}
        </Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleUserLayout;
