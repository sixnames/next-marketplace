import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_APP, ROUTE_CMS } from 'config/common';
import { ConfigModel } from 'db/dbModels';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

export interface ConfigPageInterface extends PagePropsInterface {
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
}

export interface AppConfigsLayoutInterface {
  companyId?: string;
  isCms?: boolean;
}

const AppConfigsLayout: React.FC<AppConfigsLayoutInterface> = ({ children, isCms, companyId }) => {
  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Общие',
        testId: 'globals',
        path: `${isCms ? ROUTE_CMS : ROUTE_APP}${companyId ? `/${companyId}` : ''}/config`,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'analytics',
        path: `${isCms ? ROUTE_CMS : ROUTE_APP}${
          companyId ? `/${companyId}` : ''
        }/config/analytics`,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'ui',
        path: `${isCms ? ROUTE_CMS : ROUTE_APP}${companyId ? `/${companyId}` : ''}/config/ui`,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'contacts',
        path: `${isCms ? ROUTE_CMS : ROUTE_APP}${companyId ? `/${companyId}` : ''}/config/contacts`,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'seo',
        path: `${isCms ? ROUTE_CMS : ROUTE_APP}${companyId ? `/${companyId}` : ''}/config/seo`,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'catalogue',
        path: `${isCms ? ROUTE_CMS : ROUTE_APP}${
          companyId ? `/${companyId}` : ''
        }/config/catalogue`,
        exact: true,
      },
    ];
  }, [isCms, companyId]);

  return (
    <AppContentWrapper>
      <Head>
        <title>{`Настройки сайта`}</title>
      </Head>

      <Inner lowBottom>
        <Title>Настройки сайта</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default AppConfigsLayout;
