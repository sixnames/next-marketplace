import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, UserInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';

import Head from 'next/head';
import * as React from 'react';

interface ConsoleUserLayoutInterface {
  user: UserInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const ConsoleUserLayout: React.FC<ConsoleUserLayoutInterface> = ({
  user,
  children,
  breadcrumbs,
}) => {
  const basePath = useBasePath('userId');

  const navConfig = [
    {
      name: 'Детали',
      testId: 'user-details',
      path: basePath,
      exact: true,
    },
    {
      name: 'Заказы',
      testId: 'user-orders',
      path: `${basePath}/orders`,
    },
  ];

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
