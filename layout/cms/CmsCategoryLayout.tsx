import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { AppContentWrapperBreadCrumbs, CategoryInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsCategoryLayoutInterface {
  category: CategoryInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  basePath?: string;
  hideAttributesPath?: boolean;
}

const CmsCategoryLayout: React.FC<CmsCategoryLayoutInterface> = ({
  category,
  breadcrumbs,
  children,
  basePath,
  hideAttributesPath,
}) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'details',
        path: `${basePath || ROUTE_CMS}/rubrics/${category.rubricId}/categories/${category._id}`,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: `${basePath || ROUTE_CMS}/rubrics/${category.rubricId}/categories/${
          category._id
        }/attributes`,
        exact: true,
        hidden: hideAttributesPath,
      },
    ];
  }, [basePath, category._id, category.rubricId, hideAttributesPath]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{category.name}</title>
      </Head>
      <Inner lowBottom>
        <Title>{category.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsCategoryLayout;
