import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CMS } from 'config/common';
import { RubricInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';

interface CmsRubricLayoutInterface {
  rubric: RubricInterface;
}

const CmsRubricLayout: React.FC<CmsRubricLayoutInterface> = ({ rubric, children }) => {
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
    <AppContentWrapper>
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