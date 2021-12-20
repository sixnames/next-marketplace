import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { ROUTE_CONSOLE } from '../../config/common';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../db/uiInterfaces';
import { ClientNavItemInterface } from '../../types/clientTypes';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

interface CmsCompanyLayoutInterface {
  pageCompany: CompanyInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const ConsoleCompanyLayout: React.FC<CmsCompanyLayoutInterface> = ({
  pageCompany,
  breadcrumbs,
  children,
}) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'company-details',
        path: `${ROUTE_CONSOLE}/${pageCompany?._id}/config`,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'company-assets',
        path: `${ROUTE_CONSOLE}/${pageCompany?._id}/config/assets`,
        exact: true,
      },
      {
        name: 'Основные настройки',
        testId: 'company-global-config',
        path: `${ROUTE_CONSOLE}/${pageCompany?._id}/config/config`,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'company-analytics',
        path: `${ROUTE_CONSOLE}/${pageCompany?._id}/config/config/analytics`,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'company-ui',
        path: `${ROUTE_CONSOLE}/${pageCompany?._id}/config/config/ui`,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'company-contacts',
        path: `${ROUTE_CONSOLE}/${pageCompany?._id}/config/config/contacts`,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'company-seo',
        path: `${ROUTE_CONSOLE}/${pageCompany?._id}/config/config/seo`,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'company-catalogue',
        path: `${ROUTE_CONSOLE}/${pageCompany?._id}/config/config/catalogue`,
        hidden: !pageCompany?.domain,
        exact: true,
      },
    ];
  }, [pageCompany]);

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
