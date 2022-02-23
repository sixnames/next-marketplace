import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, RubricInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';

import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsRubricLayoutInterface {
  rubric: RubricInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  hideAttributesPath?: boolean;
}

const CmsRubricLayout: React.FC<CmsRubricLayoutInterface> = ({
  rubric,
  breadcrumbs,
  children,
  hideAttributesPath,
}) => {
  const { query } = useRouter();
  const basePath = useBasePath('rubricSlug');

  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Товары',
      testId: 'products',
      path: `${basePath}/products`,
    },
    {
      name: 'Атрибуты',
      testId: 'attributes',
      path: `${basePath}/attributes`,
      exact: true,
      hidden: hideAttributesPath,
    },
    {
      name: 'Категории',
      testId: 'categories',
      path: `${basePath}/categories`,
    },
    {
      name: 'Детали',
      testId: 'details',
      path: `${basePath}`,
      exact: true,
    },
    {
      name: 'SEO тексты',
      testId: 'seo-content',
      path: `${basePath}/seo-content`,
    },
  ];

  const title = query.title || rubric.name;

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{title}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{title}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsRubricLayout;
