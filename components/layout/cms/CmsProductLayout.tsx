import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import { useConfigContext } from 'components/context/configContext';
import { useUserContext } from 'components/context/userContext';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import WpNotification from 'components/WpNotification';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, ProductSummaryInterface } from 'db/uiInterfaces';
import { useDeleteProduct } from 'hooks/mutations/useProductMutations';
import { useBasePath } from 'hooks/useBasePath';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';

import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface CmsProductLayoutInterface {
  product: ProductSummaryInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  hideAttributesPath?: boolean;
  hideCategoriesPath?: boolean;
  hideConnectionsPath?: boolean;
  hideBrandPath?: boolean;
  hideAssetsPath?: boolean;
  hideCardConstructor?: boolean;
  companySlug?: string;
  hideDeleteButton?: boolean;
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
  companySlug,
  hideDeleteButton,
}) => {
  const { sessionUser } = useUserContext();
  const { domainCompany } = useConfigContext();
  const { showModal } = useAppContext();
  const basePath = useBasePath('rubricSlug');
  const productBasePath = `${basePath}/products/product/${product._id}`;
  const [deleteProductFromRubricMutation] = useDeleteProduct({
    reload: false,
    redirectUrl: basePath,
  });

  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'details',
      path: productBasePath,
      exact: true,
    },
    {
      name: 'Категории',
      testId: 'categories',
      path: `${productBasePath}/categories`,
      hidden: hideCategoriesPath,
      exact: true,
    },
    {
      name: 'Атрибуты',
      testId: 'attributes',
      path: `${productBasePath}/attributes`,
      hidden: hideAttributesPath,
      exact: true,
    },
    {
      name: 'Связи',
      testId: 'variants',
      path: `${productBasePath}/variants`,
      hidden: hideConnectionsPath,
      exact: true,
    },
    {
      name: 'Бренд / Производитель',
      testId: 'brands',
      path: `${productBasePath}/brands`,
      hidden: hideBrandPath,
      exact: true,
    },
    {
      name: 'Изображения',
      testId: 'assets',
      path: `${productBasePath}/assets`,
      hidden: hideAssetsPath,
      exact: true,
    },
    {
      name: 'Контент карточки',
      testId: 'editor',
      path: `${productBasePath}/editor`,
      hidden: hideCardConstructor,
      exact: true,
    },
  ];

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{product.cardTitle}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle
          subtitle={`Арт. ${product.itemId}`}
          testId={`${product.originalName}-product-title`}
        >
          {product.cardTitle}
        </WpTitle>
        <div className='space-y-6'>
          <div className='mb-4 flex gap-4'>
            <WpButton
              frameClassName='w-auto'
              size={'small'}
              onClick={() => {
                window.open(
                  `/${companySlug || domainCompany?.slug || DEFAULT_COMPANY_SLUG}/${DEFAULT_CITY}/${
                    product.slug
                  }`,
                  '_blank',
                );
              }}
            >
              Карточка товара
            </WpButton>
            {hideDeleteButton ? null : (
              <WpButton
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
              </WpButton>
            )}
          </div>

          {sessionUser?.role?.isContentManager ? (
            <div className='max-w-[980px]'>
              <WpNotification
                variant={'warning'}
                testId={'draft-warning'}
                message={
                  'Вы редактируете черновик товара. Все изменения должны быть утверждены модератором.'
                }
              />
            </div>
          ) : null}
        </div>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsProductLayout;
