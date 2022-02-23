import { useUserContext } from 'components/context/userContext';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { ConfigModel } from 'db/dbModels';
import { EventRubricInterface, RubricInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

export interface ConfigPageInterface {
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
  rubrics?: RubricInterface[];
  eventRubrics?: EventRubricInterface[];
}

const ConsoleConfigsLayout: React.FC = ({ children }) => {
  const { sessionUser } = useUserContext();
  const basePath = useBasePath('config');
  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Общие',
      testId: 'globals',
      path: basePath,
      exact: true,
    },
    {
      name: 'Аналитика',
      testId: 'analytics',
      path: `${basePath}/analytics`,
      exact: true,
    },
    {
      name: 'Интерфейс',
      testId: 'ui',
      path: `${basePath}/ui`,
      exact: true,
    },
    {
      name: 'Контактные данные',
      testId: 'contacts',
      path: `${basePath}/contacts`,
      exact: true,
    },
    {
      name: 'SEO',
      testId: 'seo',
      path: `${basePath}/seo`,
      exact: true,
    },
    {
      name: 'Каталог',
      testId: 'catalogue',
      path: `${basePath}/catalogue`,
      exact: true,
    },
    {
      name: 'Проект',
      testId: 'admin',
      path: `${basePath}/project`,
      exact: true,
      hidden: !sessionUser?.role?.isStaff,
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{`Настройки сайта`}</title>
      </Head>

      <Inner lowBottom>
        <WpTitle>Настройки сайта</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleConfigsLayout;
