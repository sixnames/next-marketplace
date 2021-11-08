import AssetsManager from 'components/AssetsManager';
import WpDropZone from 'components/FormElements/Upload/WpDropZone';
import Inner from 'components/Inner';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { ProductInterface } from 'db/uiInterfaces';
import {
  useDeleteProductAsset,
  useUpdateProductAssetIndex,
} from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getCmsProduct } from 'lib/productUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ProductAssetsInterface {
  product: ProductInterface;
}

const ProductAssets: React.FC<ProductAssetsInterface> = ({ product }) => {
  const router = useRouter();
  const { showLoading, hideLoading, showErrorNotification } = useMutationCallbacks({
    reload: true,
  });

  const [deleteProductAssetMutation] = useDeleteProductAsset();
  const [updateProductAssetIndexMutation] = useUpdateProductAssetIndex();

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Изображения',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${product.rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/${product.rubric?._id}`,
      },
      {
        name: `${product.cardTitle}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <Inner testId={'product-assets-list'}>
        <AssetsManager
          initialAssets={product.assets?.assets || []}
          assetsTitle={product.originalName}
          onRemoveHandler={(assetIndex) => {
            deleteProductAssetMutation({
              productId: `${product._id}`,
              assetIndex,
            }).catch((e) => console.log(e));
          }}
          onReorderHandler={({ assetNewIndex, assetUrl }) => {
            updateProductAssetIndexMutation({
              productId: `${product._id}`,
              assetNewIndex,
              assetUrl,
            }).catch((e) => console.log(e));
          }}
        />

        <WpDropZone
          testId={'product-images'}
          label={'Добавить изображения'}
          onDropHandler={(acceptedFiles) => {
            if (acceptedFiles) {
              showLoading();
              const formData = new FormData();
              alwaysArray(acceptedFiles).forEach((file, index) => {
                formData.append(`assets[${index}]`, file);
              });
              formData.append('productId', `${product._id}`);

              fetch('/api/product/add-product-asset', {
                method: 'POST',
                body: formData,
              })
                .then((res) => {
                  return res.json();
                })
                .then((json) => {
                  if (json.success) {
                    router.reload();
                    return;
                  }
                  hideLoading();
                  showErrorNotification({ title: json.message });
                })
                .catch(() => {
                  hideLoading();
                  showErrorNotification({ title: 'error' });
                });
            }
          }}
        />
      </Inner>
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductAssetsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductAssets {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
    },
  };
};

export default Product;
