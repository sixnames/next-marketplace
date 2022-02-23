import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, UserInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsUserLayoutInterface {
  user: UserInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsUserLayout: React.FC<CmsUserLayoutInterface> = ({ user, children, breadcrumbs }) => {
  const basePath = useBasePath('userId');

  const navConfig: ClientNavItemInterface[] = [
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
    {
      name: 'Изображения',
      testId: 'user-assets',
      path: `${basePath}/assets`,
      exact: true,
    },
    {
      name: 'Оповещения',
      testId: 'user-notifications',
      path: `${basePath}/notifications`,
      exact: true,
    },
    {
      name: 'Категории',
      testId: 'user-categories',
      path: `${basePath}/categories`,
      exact: true,
    },
    {
      name: 'Пароль',
      testId: 'user-password',
      path: `${basePath}/password`,
      exact: true,
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
              <div className='ml-4'>{user.role?.name}</div>
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

export default CmsUserLayout;
