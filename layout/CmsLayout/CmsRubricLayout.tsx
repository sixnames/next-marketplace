import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { RubricInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';

interface CmsRubricLayoutInterface {
  rubric: RubricInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsRubricLayout: React.FC<CmsRubricLayoutInterface> = ({ rubric, breadcrumbs, children }) => {
  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Товары',
        testId: 'products',
        path: `${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: `${ROUTE_CMS}/rubrics/${rubric._id}/attributes`,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'details',
        path: `${ROUTE_CMS}/rubrics/${rubric._id}`,
        exact: true,
      },
    ];
  }, [rubric._id]);

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
