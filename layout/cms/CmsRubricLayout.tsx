import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { RubricInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
  const { query } = useRouter();

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
        testId: 'seo-content',
        path: `${basePath || ROUTE_CMS}/rubrics/${rubric._id}/seo-content`,
      },
    ];
  }, [basePath, hideAttributesPath, rubric._id]);

  const title = query.title || rubric.name;

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{title}</title>
      </Head>
      <Inner lowBottom>
        <Title>{title}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsRubricLayout;
