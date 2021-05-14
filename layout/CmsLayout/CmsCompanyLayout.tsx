import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CMS } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';

interface CmsCompanyLayoutInterface {
  company: CompanyInterface;
}

const CmsCompanyLayout: React.FC<CmsCompanyLayoutInterface> = ({ company, children }) => {
  const navConfig = React.useMemo(() => {
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
        path: `${ROUTE_CMS}/companies/${company._id}/shops`,
        exact: true,
      },
    ];
  }, [company._id]);

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
