import AssetsManager from 'components/Assets/AssetsManager';
import Button from 'components/Buttons/Button';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import Inner from 'components/Inner/Inner';
import { COL_PRODUCT_ASSETS, COL_PRODUCTS } from 'db/collectionNames';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  useDeleteProductAssetMutation,
  useUpdateProductAssetIndexMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { addProductAssetsSchema } from 'validation/productSchema';

interface ProductAssetsInterface {
  product: ProductInterface;
}

const ProductAssets: React.FC<ProductAssetsInterface> = ({ product }) => {
  const router = useRouter();
  const {
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    hideLoading,
    showErrorNotification,
  } = useMutationCallbacks({
    reload: true,
  });
  const validationSchema = useValidationSchema({
    schema: addProductAssetsSchema,
  });

  const [deleteProductAssetMutation] = useDeleteProductAssetMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProductAsset),
  });

  const [updateProductAssetIndexMutation] = useUpdateProductAssetIndexMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductAssetIndex),
  });

  return (
    <CmsProductLayout product={product}>
      <Inner>
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

        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{ assets: [], productId: product._id }}
          onSubmit={(values) => {
            if (values.assets) {
              showLoading();
              const formData = new FormData();
              values.assets.forEach((file, index) => {
                formData.append(`assets[${index}]`, file);
              });
              formData.append('productId', `${values.productId}`);

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
        >
          {() => {
            return (
              <Form noValidate>
                <FormikDropZone
                  tooltip={'Подсказка для загрузки изображения'}
                  label={'Добавить изображения'}
                  name={'assets'}
                  testId={'product-images'}
                />

                <Button testId={'submit-product'} type={'submit'}>
                  Добавить
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductAssetsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductAssets product={product} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const db = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !productId) {
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
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(product),
    },
  };
};

export default Product;
