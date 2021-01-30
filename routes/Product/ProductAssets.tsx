import AssetsManager from 'components/Assets/AssetsManager';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import { PRODUCT_QUERY } from 'graphql/complex/productsQueries';
import * as React from 'react';
import {
  CmsProductFragment,
  useAddProductAssetsMutation,
  useDeleteProductAssetMutation,
  useUpdateProductAssetIndexMutation,
} from 'generated/apolloComponents';
import InnerWide from '../../components/Inner/InnerWide';
import { Form, Formik } from 'formik';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { addProductAssetsSchema } from 'validation/productSchema';

interface ProductDetailsInterface {
  product: CmsProductFragment;
}

const ProductAssets: React.FC<ProductDetailsInterface> = ({ product }) => {
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks();
  const validationSchema = useValidationSchema({
    schema: addProductAssetsSchema,
  });

  const refetchQueries = [
    {
      query: PRODUCT_QUERY,
      variables: {
        _id: product._id,
      },
    },
  ];

  const [addProductAssetsMutation] = useAddProductAssetsMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.addProductAssets),
    refetchQueries,
  });

  const [deleteProductAssetMutation] = useDeleteProductAssetMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProductAsset),
    refetchQueries,
  });

  const [updateProductAssetIndexMutation] = useUpdateProductAssetIndexMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductAssetIndex),
    refetchQueries,
  });

  const { name } = product;

  return (
    <InnerWide testId={'product-assets'}>
      <AssetsManager
        initialAssets={product.assets}
        assetsTitle={name}
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
        onSubmit={(values, formikHelpers) => {
          showLoading();
          addProductAssetsMutation({
            variables: {
              input: values,
            },
            update: () => {
              formikHelpers.resetForm();
            },
          }).catch((e) => console.log(e));
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
    </InnerWide>
  );
};

export default ProductAssets;
