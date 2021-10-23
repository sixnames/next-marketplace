import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { ProductInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsProductLayoutInterface {
  product: ProductInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  basePath?: string;
  hideAttributesPath?: boolean;
  hideCategoriesPath?: boolean;
  hideConnectionsPath?: boolean;
  hideBrandPath?: boolean;
  hideAssetsPath?: boolean;
}

const CmsProductLayout: React.FC<CmsProductLayoutInterface> = ({
  product,
  breadcrumbs,
  hideAttributesPath,
  hideCategoriesPath,
  hideConnectionsPath,
  hideBrandPath,
  hideAssetsPath,
  children,
  basePath,
}) => {
  const { query } = useRouter();
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'details',
        path: `${basePath || ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${product._id}`,
        exact: true,
      },
      {
        name: 'Категории',
        testId: 'categories',
        path: `${basePath || ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${
          product._id
        }/categories`,
        hidden: hideCategoriesPath,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: `${basePath || ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${
          product._id
        }/attributes`,
        hidden: hideAttributesPath,
        exact: true,
      },
      {
        name: 'Связи',
        testId: 'connections',
        path: `${basePath || ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${
          product._id
        }/connections`,
        hidden: hideConnectionsPath,
        exact: true,
      },
      {
        name: 'Бренд / Производитель / Поставщики',
        testId: 'brands',
        path: `${basePath || ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${
          product._id
        }/brands`,
        hidden: hideBrandPath,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'assets',
        path: `${basePath || ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${
          product._id
        }/assets`,
        hidden: hideAssetsPath,
        exact: true,
      },
      {
        name: 'Контент карточки',
        testId: 'constructor',
        path: `${basePath || ROUTE_CMS}/rubrics/${query.rubricId}/products/product/${
          product._id
        }/constructor`,
        exact: true,
      },
    ];
  }, [
    basePath,
    hideAssetsPath,
    hideAttributesPath,
    hideBrandPath,
    hideCategoriesPath,
    hideConnectionsPath,
    product._id,
    query.rubricId,
  ]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{product.cardTitle}</title>
      </Head>
      <Inner lowBottom>
        <Title subtitle={`Арт. ${product.itemId}`} testId={`${product.originalName}-product-title`}>
          {product.cardTitle}
        </Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsProductLayout;
