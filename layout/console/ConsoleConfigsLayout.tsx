import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CONSOLE, ROUTE_CMS } from 'config/common';
import { useUserContext } from 'context/userContext';
import { ConfigModel } from 'db/dbModels';
import { RubricInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

export interface ConfigPageInterface {
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
  rubrics?: RubricInterface[];
}

export interface AppConfigsLayoutInterface {
  companyId?: string;
  isCms?: boolean;
}

const ConsoleConfigsLayout: React.FC<AppConfigsLayoutInterface> = ({
  children,
  isCms,
  companyId,
}) => {
  const { me } = useUserContext();

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Общие',
        testId: 'globals',
        path: isCms ? `${ROUTE_CMS}/config` : `${ROUTE_CONSOLE}/${companyId}/config`,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'analytics',
        path: isCms
          ? `${ROUTE_CMS}/config/analytics`
          : `${ROUTE_CONSOLE}/${companyId}/config/analytics`,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'ui',
        path: isCms ? `${ROUTE_CMS}/config/ui` : `${ROUTE_CONSOLE}/${companyId}/config/ui`,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'contacts',
        path: isCms
          ? `${ROUTE_CMS}/config/contacts`
          : `${ROUTE_CONSOLE}/${companyId}/config/contacts`,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'seo',
        path: isCms ? `${ROUTE_CMS}/config/seo` : `${ROUTE_CONSOLE}/${companyId}/config/seo`,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'catalogue',
        path: isCms
          ? `${ROUTE_CMS}/config/catalogue`
          : `${ROUTE_CONSOLE}/${companyId}/config/catalogue`,
        exact: true,
      },
      {
        name: 'Проект',
        testId: 'admin',
        path: `${ROUTE_CMS}/config/project`,
        exact: true,
        hidden: !me?.role?.isStaff,
      },
    ];
  }, [isCms, companyId, me]);

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

export default ConsoleConfigsLayout;
