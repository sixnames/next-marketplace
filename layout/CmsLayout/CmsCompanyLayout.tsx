import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsCompanyLayoutInterface {
  company: CompanyInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsCompanyLayout: React.FC<CmsCompanyLayoutInterface> = ({
  company,
  breadcrumbs,
  children,
}) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'company-details',
        path: `${ROUTE_CMS}/companies/${company._id}`,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'company-assets',
        path: `${ROUTE_CMS}/companies/${company._id}/assets`,
        exact: true,
      },
      {
        name: 'Магазины',
        testId: 'company-shops',
        path: `${ROUTE_CMS}/companies/${company._id}/shops/${company._id}`,
        exact: true,
      },
      {
        name: 'Страницы',
        testId: 'company-pages',
        path: `${ROUTE_CMS}/companies/${company._id}/pages`,
        hidden: !company.domain,
      },
      {
        name: 'Основные настройки',
        testId: 'company-global-config',
        path: `${ROUTE_CMS}/companies/${company._id}/config`,
        hidden: !company.domain,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'company-analytics',
        path: `${ROUTE_CMS}/companies/${company._id}/config/analytics`,
        hidden: !company.domain,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'company-ui',
        path: `${ROUTE_CMS}/companies/${company._id}/config/ui`,
        hidden: !company.domain,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'company-contacts',
        path: `${ROUTE_CMS}/companies/${company._id}/config/contacts`,
        hidden: !company.domain,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'company-seo',
        path: `${ROUTE_CMS}/companies/${company._id}/config/seo`,
        hidden: !company.domain,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'company-catalogue',
        path: `${ROUTE_CMS}/companies/${company._id}/config/catalogue`,
        hidden: !company.domain,
        exact: true,
      },
    ];
  }, [company._id, company.domain]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{company.name}</title>
      </Head>
      <Inner lowBottom>
        <Title>{company.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsCompanyLayout;
