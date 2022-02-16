import { useUserContext } from 'components/context/userContext';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { ConfigModel } from 'db/dbModels';
import { RubricInterface } from 'db/uiInterfaces';
import { getConsoleConfigsLinks } from 'lib/linkUtils';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

export interface ConfigPageInterface {
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
  rubrics?: RubricInterface[];
}

export interface AppConfigsLayoutInterface {
  basePath?: string;
}

const ConsoleConfigsLayout: React.FC<AppConfigsLayoutInterface> = ({ children, basePath }) => {
  const { sessionUser } = useUserContext();

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    const links = getConsoleConfigsLinks({
      basePath,
    });
    return [
      {
        name: 'Общие',
        testId: 'globals',
        path: links.root,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'analytics',
        path: links.analytics,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'ui',
        path: links.ui,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'contacts',
        path: links.contacts,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'seo',
        path: links.seo,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'catalogue',
        path: links.catalogue,
        exact: true,
      },
      {
        name: 'Проект',
        testId: 'admin',
        path: links.project,
        exact: true,
        hidden: !sessionUser?.role?.isStaff,
      },
    ];
  }, [basePath, sessionUser]);

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
