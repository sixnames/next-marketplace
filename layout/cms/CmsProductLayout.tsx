import Button from 'components/button/Button';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Title from 'components/Title';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { ProductInterface } from 'db/uiInterfaces';
import { useDeleteProduct } from 'hooks/mutations/useProductMutations';
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
  hideCardConstructor?: boolean;
  companySlug?: string;
}

const CmsProductLayout: React.FC<CmsProductLayoutInterface> = ({
  product,
  breadcrumbs,
  hideAttributesPath,
  hideCategoriesPath,
  hideConnectionsPath,
  hideBrandPath,
  hideAssetsPath,
  hideCardConstructor,
  children,
  basePath,
  companySlug,
}) => {
  const { query } = useRouter();
  const { showModal } = useAppContext();
  const [deleteProductFromRubricMutation] = useDeleteProduct({
    reload: false,
    redirectUrl: `${basePath || ROUTE_CMS}/rubrics/${query.rubricId}/products/${query.rubricId}`,
  });

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
        name: 'Бренд / Производитель',
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
        hidden: hideCardConstructor,
        exact: true,
      },
    ];
  }, [
    basePath,
    hideAssetsPath,
    hideAttributesPath,
    hideBrandPath,
    hideCardConstructor,
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
        <div className='mb-4 flex gap-4'>
          <Button
            frameClassName='w-auto'
            size={'small'}
            onClick={() => {
              window.open(
                `/${companySlug || DEFAULT_COMPANY_SLUG}/${DEFAULT_CITY}/${product.slug}`,
                '_blank',
              );
            }}
          >
            Карточка товара
          </Button>
          <Button
            frameClassName='w-auto'
            theme={'secondary'}
            size={'small'}
            onClick={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-product-modal',
                  message: `Вы уверенны, что хотите удалить товар ${product.cardTitle}?`,
                  confirm: () => {
                    deleteProductFromRubricMutation({
                      productId: `${product._id}`,
                    }).catch((e) => console.log(e));
                  },
                },
              });
            }}
          >
            Удалить товар
          </Button>
        </div>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsProductLayout;
