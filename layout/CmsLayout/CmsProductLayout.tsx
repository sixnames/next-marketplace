import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CMS } from 'config/common';
import { ProductModel } from 'db/dbModels';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

interface CmsProductLayoutInterface {
  product: ProductModel;
}

const CmsProductLayout: React.FC<CmsProductLayoutInterface> = ({ product, children }) => {
  const { query } = useRouter();
  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Детали',
        testId: 'details',
        path: `${ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${product._id}`,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: `${ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${product._id}/attributes`,
        exact: true,
      },
      {
        name: 'Связи',
        testId: 'connections',
        path: `${ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${product._id}/connections`,
        exact: true,
      },
      {
        name: 'Бренды / Производители',
        testId: 'brands',
        path: `${ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${product._id}/brands`,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'assets',
        path: `${ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${product._id}/assets`,
        exact: true,
      },
    ];
  }, [product._id, query.rubricId]);

  return (
    <AppContentWrapper>
      <Head>
        <title>{product.originalName}</title>
      </Head>
      <Inner lowBottom>
        <Title>{product.originalName}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsProductLayout;
