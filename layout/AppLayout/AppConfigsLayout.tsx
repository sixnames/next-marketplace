import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CONSOLE, ROUTE_CMS } from 'config/common';
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
        path: isCms ? `${ROUTE_CMS}/config` : `${ROUTE_CONSOLE}/config/${companyId}`,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'analytics',
        path: isCms
          ? `${ROUTE_CMS}/config/analytics`
          : `${ROUTE_CONSOLE}/config/${companyId}/analytics`,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'ui',
        path: isCms ? `${ROUTE_CMS}/config/ui` : `${ROUTE_CONSOLE}/config/${companyId}/ui`,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'contacts',
        path: isCms
          ? `${ROUTE_CMS}/config/contacts`
          : `${ROUTE_CONSOLE}/config/${companyId}/contacts`,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'seo',
        path: isCms ? `${ROUTE_CMS}/config/seo` : `${ROUTE_CONSOLE}/config/${companyId}/seo`,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'catalogue',
        path: isCms
          ? `${ROUTE_CMS}/config/catalogue`
          : `${ROUTE_CONSOLE}/config/${companyId}/catalogue`,
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
