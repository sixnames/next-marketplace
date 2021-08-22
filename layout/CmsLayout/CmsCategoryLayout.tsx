import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { CategoryInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';

interface CmsCategoryLayoutInterface {
  rubricId: string;
  category: CategoryInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsCategoryLayout: React.FC<CmsCategoryLayoutInterface> = ({
  rubricId,
  category,
  breadcrumbs,
  children,
}) => {
  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Товары',
        testId: 'products',
        path: `${ROUTE_CMS}/rubrics/${rubricId}/categories/${category._id}/products/${category._id}`,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: `${ROUTE_CMS}/rubrics/${rubricId}/categories/${category._id}/attributes`,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'details',
        path: `${ROUTE_CMS}/rubrics/${rubricId}/categories/${category._id}`,
        exact: true,
      },
    ];
  }, [category._id, rubricId]);

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
