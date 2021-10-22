import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { RubricInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsRubricLayoutInterface {
  rubric: RubricInterface;
  basePath?: string;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsRubricLayout: React.FC<CmsRubricLayoutInterface> = ({
  rubric,
  basePath,
  breadcrumbs,
  children,
}) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Товары',
        testId: 'products',
        path: `${basePath || ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: `${basePath || ROUTE_CMS}/rubrics/${rubric._id}/attributes`,
        exact: true,
        hidden: Boolean(basePath),
      },
      {
        name: 'Категории',
        testId: 'categories',
        path: `${basePath || ROUTE_CMS}/rubrics/${rubric._id}/categories`,
      },
      {
        name: 'Детали',
        testId: 'details',
        path: `${basePath || ROUTE_CMS}/rubrics/${rubric._id}`,
        exact: true,
      },
    ];
  }, [basePath, rubric._id]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{rubric.name}</title>
      </Head>
      <Inner lowBottom>
        <Title>{rubric.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsRubricLayout;
