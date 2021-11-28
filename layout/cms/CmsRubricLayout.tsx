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
  hideAttributesPath?: boolean;
}

const CmsRubricLayout: React.FC<CmsRubricLayoutInterface> = ({
  rubric,
  basePath,
  breadcrumbs,
  children,
  hideAttributesPath,
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
        hidden: hideAttributesPath,
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
      {
        name: 'SEO тексты',
        testId: 'seo-texts',
        path: `${basePath || ROUTE_CMS}/rubrics/${rubric._id}/seo-texts`,
        exact: true,
      },
    ];
  }, [basePath, hideAttributesPath, rubric._id]);

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
