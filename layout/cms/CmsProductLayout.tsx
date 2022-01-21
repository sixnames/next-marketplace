import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import WpButton from '../../components/button/WpButton';
import Inner from '../../components/Inner';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal';
import WpTitle from '../../components/WpTitle';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG } from '../../config/common';
import { CONFIRM_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useConfigContext } from '../../context/configContext';
import { AppContentWrapperBreadCrumbs, ProductSummaryInterface } from '../../db/uiInterfaces';
import { useDeleteProduct } from '../../hooks/mutations/useProductMutations';
import { getConsoleRubricLinks } from '../../lib/linkUtils';
import { ClientNavItemInterface } from '../../types/clientTypes';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

interface CmsProductLayoutInterface {
  product: ProductSummaryInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  basePath?: string;
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
  basePath,
  companySlug,
  hideDeleteButton,
}) => {
  const { query } = useRouter();
  const { domainCompany } = useConfigContext();
  const { showModal } = useAppContext();
  const rubricLinks = getConsoleRubricLinks({
    rubricSlug: `${query.rubricSlug}`,
    basePath,
  });
  const [deleteProductFromRubricMutation] = useDeleteProduct({
    reload: false,
    redirectUrl: rubricLinks.product.parentLink,
  });

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    const links = getConsoleRubricLinks({
      productId: product._id,
      rubricSlug: product.rubricSlug,
      basePath,
    });
    return [
      {
        name: 'Детали',
        testId: 'details',
        path: links.product.root,
        exact: true,
      },
      {
        name: 'Категории',
        testId: 'categories',
        path: links.product.categories,
        hidden: hideCategoriesPath,
        exact: true,
      },
      {
        name: 'Атрибуты',
        testId: 'attributes',
        path: links.product.attributes,
        hidden: hideAttributesPath,
        exact: true,
      },
      {
        name: 'Связи',
        testId: 'connections',
        path: links.product.variants,
        hidden: hideConnectionsPath,
        exact: true,
      },
      {
        name: 'Бренд / Производитель',
        testId: 'brands',
        path: links.product.brands,
        hidden: hideBrandPath,
        exact: true,
      },
      {
        name: 'Изображения',
        testId: 'assets',
        path: links.product.assets,
        hidden: hideAssetsPath,
        exact: true,
      },
      {
        name: 'Контент карточки',
        testId: 'constructor',
        path: links.product.constructor,
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
    product.rubricSlug,
  ]);

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
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default CmsProductLayout;
