import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { AppContentWrapperBreadCrumbs, UserInterface } from '../../db/uiInterfaces';
import { getCmsLinks } from '../../lib/linkUtils';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

interface CmsUserLayoutInterface {
  user: UserInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsUserLayout: React.FC<CmsUserLayoutInterface> = ({ user, children, breadcrumbs }) => {
  const navConfig = React.useMemo(() => {
    const links = getCmsLinks({
      userId: user._id,
    });
    return [
      {
        name: 'Детали',
        testId: 'user-details',
        path: links.user.root,
        exact: true,
      },
      {
        name: 'Заказы',
        testId: 'user-orders',
        path: links.user.order.parentLink,
      },
      {
        name: 'Изображения',
        testId: 'user-assets',
        path: links.user.assets,
        exact: true,
      },
      {
        name: 'Оповещения',
        testId: 'user-notifications',
        path: links.user.notifications,
        exact: true,
      },
      {
        name: 'Категории',
        testId: 'user-categories',
        path: links.user.categories,
        exact: true,
      },
      {
        name: 'Пароль',
        testId: 'user-password',
        path: links.user.password,
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
