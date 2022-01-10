import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../db/uiInterfaces';
import { getConsoleCompanyLinks } from '../../lib/linkUtils';
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
    const links = getConsoleCompanyLinks({
      companyId: pageCompany._id,
    });

    return [
      {
        name: 'Детали',
        testId: 'company-details',
        path: links.config.root,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'company-assets',
        path: links.config.assets,
        exact: true,
      },
      {
        name: 'Основные настройки',
        testId: 'company-global-config',
        path: links.config.config.root,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'company-analytics',
        path: links.config.config.analytics,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'company-ui',
        path: links.config.config.ui,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'company-contacts',
        path: links.config.config.contacts,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'company-seo',
        path: links.config.config.seo,
        hidden: !pageCompany?.domain,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'company-catalogue',
        path: links.config.config.catalogue,
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
