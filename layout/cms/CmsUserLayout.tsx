import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { ROUTE_CMS } from '../../config/common';
import { AppContentWrapperBreadCrumbs, UserInterface } from '../../db/uiInterfaces';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

interface CmsUserLayoutInterface {
  user: UserInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsUserLayout: React.FC<CmsUserLayoutInterface> = ({ user, children, breadcrumbs }) => {
  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Детали',
        testId: 'user-details',
        path: `${ROUTE_CMS}/users/user/${user._id}`,
        exact: true,
      },
      {
        name: 'Заказы',
        testId: 'user-orders',
        path: `${ROUTE_CMS}/users/user/${user._id}/orders`,
      },
      {
        name: 'Изображения',
        testId: 'user-assets',
        path: `${ROUTE_CMS}/users/user/${user._id}/assets`,
        exact: true,
      },
      {
        name: 'Оповещения',
        testId: 'user-notifications',
        path: `${ROUTE_CMS}/users/user/${user._id}/notifications`,
        exact: true,
      },
      {
        name: 'Категории',
        testId: 'user-categories',
        path: `${ROUTE_CMS}/users/user/${user._id}/categories`,
        exact: true,
      },
      {
        name: 'Пароль',
        testId: 'user-password',
        path: `${ROUTE_CMS}/users/user/${user._id}/password`,
        exact: true,
      },
    ];
  }, [user._id]);

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
