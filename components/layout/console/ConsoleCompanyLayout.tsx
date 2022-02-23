import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';

import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsCompanyLayoutInterface {
  pageCompany: CompanyInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const ConsoleCompanyLayout: React.FC<CmsCompanyLayoutInterface> = ({
  pageCompany,
  breadcrumbs,
  children,
}) => {
  const basePath = useBasePath('config');

  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'company-details',
      path: basePath,
      exact: true,
    },
    {
      name: 'Изображения',
      testId: 'company-assets',
      path: `${basePath}/assets`,
      exact: true,
    },
    {
      name: 'Основные настройки',
      testId: 'company-global-config',
      path: `${basePath}/config`,
      hidden: !pageCompany?.domain,
      exact: true,
    },
    {
      name: 'Аналитика',
      testId: 'company-analytics',
      path: `${basePath}/config/analytics`,
      hidden: !pageCompany?.domain,
      exact: true,
    },
    {
      name: 'Интерфейс',
      testId: 'company-ui',
      path: `${basePath}/config/ui`,
      hidden: !pageCompany?.domain,
      exact: true,
    },
    {
      name: 'Контактные данные',
      testId: 'company-contacts',
      path: `${basePath}/config/contacts`,
      hidden: !pageCompany?.domain,
      exact: true,
    },
    {
      name: 'SEO',
      testId: 'company-seo',
      path: `${basePath}/config/seo`,
      hidden: !pageCompany?.domain,
      exact: true,
    },
    {
      name: 'Каталог',
      testId: 'company-catalogue',
      path: `${basePath}/config/catalogue`,
      hidden: !pageCompany?.domain,
      exact: true,
    },
  ];

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{pageCompany?.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{pageCompany?.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleCompanyLayout;
