import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_APP } from 'config/common';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

const AppConfigsLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Общие',
        testId: 'globals',
        path: `${ROUTE_APP}/${router.query.companyId}/config`,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'analytics',
        path: `${ROUTE_APP}/${router.query.companyId}/config/analytics`,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'ui',
        path: `${ROUTE_APP}/${router.query.companyId}/config/ui`,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'contacts',
        path: `${ROUTE_APP}/${router.query.companyId}/config/contacts`,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'seo',
        path: `${ROUTE_APP}/${router.query.companyId}/config/seo`,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'catalogue',
        path: `${ROUTE_APP}/${router.query.companyId}/config/catalogue`,
        exact: true,
      },
    ];
  }, [router.query.companyId]);

  return (
    <div className={'pt-11'}>
      <Head>
        <title>{`Настройки сайта`}</title>
      </Head>

      <Inner lowBottom>
        <Title>Настройки сайта</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </div>
  );
};

export default AppConfigsLayout;
