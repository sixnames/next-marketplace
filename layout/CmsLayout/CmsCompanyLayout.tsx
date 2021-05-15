import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CMS } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';
import { NavItemInterface } from 'types/clientTypes';

interface CmsCompanyLayoutInterface {
  company: CompanyInterface;
}

const CmsCompanyLayout: React.FC<CmsCompanyLayoutInterface> = ({ company, children }) => {
  const navConfig = React.useMemo<NavItemInterface[]>(() => {
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
        name: 'Основные настройки',
        testId: 'company-global-config',
        path: `${ROUTE_CMS}/companies/${company._id}/config`,
        disabled: !company.domain,
        exact: true,
      },
      {
        name: 'Аналитика',
        testId: 'company-analytics',
        path: `${ROUTE_CMS}/companies/${company._id}/analytics`,
        disabled: !company.domain,
        exact: true,
      },
      {
        name: 'Интерфейс',
        testId: 'company-ui',
        path: `${ROUTE_CMS}/companies/${company._id}/ui`,
        disabled: !company.domain,
        exact: true,
      },
      {
        name: 'Контактные данные',
        testId: 'company-contacts',
        path: `${ROUTE_CMS}/companies/${company._id}/contacts`,
        disabled: !company.domain,
        exact: true,
      },
      {
        name: 'SEO',
        testId: 'company-seo',
        path: `${ROUTE_CMS}/companies/${company._id}/seo`,
        disabled: !company.domain,
        exact: true,
      },
      {
        name: 'Каталог',
        testId: 'company-catalogue',
        path: `${ROUTE_CMS}/companies/${company._id}/catalogue`,
        disabled: !company.domain,
        exact: true,
      },
    ];
  }, [company._id, company.domain]);

  return (
    <AppContentWrapper>
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
