import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, CategoryInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';

import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsCategoryLayoutInterface {
  category: CategoryInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  hideAttributesPath?: boolean;
}

const CmsCategoryLayout: React.FC<CmsCategoryLayoutInterface> = ({
  category,
  breadcrumbs,
  children,
  hideAttributesPath,
}) => {
  const basePath = useBasePath('categoryId');

  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'details',
      path: basePath,
      exact: true,
    },
    {
      name: 'Атрибуты',
      testId: 'attributes',
      path: `${basePath}/attributes`,
      exact: true,
      hidden: hideAttributesPath,
    },
  ];

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{category.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{category.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsCategoryLayout;
