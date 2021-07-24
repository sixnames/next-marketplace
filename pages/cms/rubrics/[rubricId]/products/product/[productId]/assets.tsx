import AssetsManager from 'components/Assets/AssetsManager';
import WpDropZone from 'components/FormElements/Upload/WpDropZone';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_PRODUCT_ASSETS, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import { ProductModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductInterface, RubricInterface } from 'db/uiInterfaces';
import {
  useDeleteProductAssetMutation,
  useUpdateProductAssetIndexMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ProductAssetsInterface {
  product: ProductInterface;
  rubric: RubricInterface;
}

const ProductAssets: React.FC<ProductAssetsInterface> = ({ product, rubric }) => {
  const router = useRouter();
  const { onErrorCallback, onCompleteCallback, showLoading, hideLoading, showErrorNotification } =
    useMutationCallbacks({
      reload: true,
    });

  const [deleteProductAssetMutation] = useDeleteProductAssetMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProductAsset),
  });

  const [updateProductAssetIndexMutation] = useUpdateProductAssetIndexMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductAssetIndex),
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Изображения',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: product.originalName,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/product/${product._id}`,
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
              variables: {
                input: {
                  productId: product._id,
                  assetIndex,
                },
              },
            }).catch((e) => console.log(e));
          }}
          onReorderHandler={({ assetNewIndex, assetUrl }) => {
            updateProductAssetIndexMutation({
              variables: {
                input: {
                  productId: product._id,
                  assetNewIndex,
                  assetUrl,
                },
              },
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

              fetch('/api/add-product-asset', {
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

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductAssets product={product} rubric={rubric} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const productAggregation = await productsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
      {
        $lookup: {
          as: 'assets',
          from: COL_PRODUCT_ASSETS,
          localField: '_id',
          foreignField: 'productId',
        },
      },
      {
        $addFields: {
          assets: {
            $arrayElemAt: ['$assets', 0],
          },
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];

  const initialRubric = await rubricsCollection.findOne({
    _id: new ObjectId(`${rubricId}`),
  });

  if (!product || !initialRubric) {
    return {
      notFound: true,
    };
  }

  const rubric: RubricInterface = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      product: castDbData(product),
      rubric: castDbData(rubric),
    },
  };
};

export default Product;
