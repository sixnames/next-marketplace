import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { UserInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';

interface CmsUserLayoutInterface {
  user: UserInterface;
}

const CmsUserLayout: React.FC<CmsUserLayoutInterface> = ({ user, children }) => {
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
        name: 'Пароль',
        testId: 'user-password',
        path: `${ROUTE_CMS}/users/user/${user._id}/password`,
        exact: true,
      },
    ];
  }, [user._id]);

  return (
    <AppContentWrapper>
      <Head>
        <title>{user.fullName}</title>
      </Head>
      <Inner lowBottom>
        <Title
          subtitle={
            <div className='flex'>
              <div>{`ID ${user.itemId}`}</div>
              <div className='ml-4'>{user.role?.name}</div>
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

export default CmsUserLayout;
