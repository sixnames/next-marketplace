import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { ProductInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

interface CmsProductLayoutInterface {
  product: ProductInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsProductLayout: React.FC<CmsProductLayoutInterface> = ({
  product,
  breadcrumbs,
  children,
}) => {
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
        name: 'Бренд / Производитель / Поставщик',
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
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{product.originalName}</title>
      </Head>
      <Inner lowBottom>
        <Title subtitle={`Арт. ${product.itemId}`} testId={`${product.originalName}-product-title`}>
          {product.originalName}
        </Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsProductLayout;
