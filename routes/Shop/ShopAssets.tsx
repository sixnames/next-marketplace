import AssetsManager from 'components/Assets/AssetsManager';
import Button from 'components/Buttons/Button';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import InnerWide from 'components/Inner/InnerWide';
import { Form, Formik } from 'formik';
import {
  ShopFragment,
  useAddShopAssetsMutation,
  useDeleteShopAssetMutation,
  useUpdateShopAssetIndexMutation,
  useUpdateShopLogoMutation,
} from 'generated/apolloComponents';
import { SHOP_QUERY } from 'graphql/query/companiesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { addShopAssetsSchema } from 'validation/shopSchema';
import classes from './ShopAssets.module.css';
import * as React from 'react';

interface ShopAssetsInterface {
  shop: ShopFragment;
}

const ShopAssets: React.FC<ShopAssetsInterface> = ({ shop }) => {
  const { _id, slug, logo, name } = shop;
  const {
    onErrorCallback,
    showErrorNotification,
    onCompleteCallback,
    showLoading,
  } = useMutationCallbacks({});
  const validationSchema = useValidationSchema({
    schema: addShopAssetsSchema,
  });

  const refetchQueries = [
    {
      query: SHOP_QUERY,
      variables: {
        _id,
      },
    },
  ];

  const [updateShopLogoMutation] = useUpdateShopLogoMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShopLogo),
    refetchQueries,
  });

  const [addShopAssetsMutation] = useAddShopAssetsMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.addShopAssets),
    refetchQueries,
  });

  const [deleteShopAssetMutation] = useDeleteShopAssetMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteShopAsset),
    refetchQueries,
  });

  const [updateShopAssetIndexMutation] = useUpdateShopAssetIndexMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShopAssetIndex),
    refetchQueries,
  });

  return (
    <InnerWide testId={'shop-assets'}>
      <Formik
        enableReinitialize
        initialValues={{ logo: [logo.url] }}
        onSubmit={(values) => console.log(values)}
      >
        {({ values: { logo } }) => {
          const isEmpty = !logo || !logo.length;

          return (
            <Form>
              <FormikImageUpload
                label={'Логотип магазина'}
                name={'logo'}
                testId={slug}
                width={'10rem'}
                height={'10rem'}
                format={'image/png'}
                setImageHandler={(files) => {
                  if (files) {
                    showLoading();
                    updateShopLogoMutation({
                      variables: {
                        input: {
                          shopId: _id,
                          logo: [files[0]],
                        },
                      },
                    }).catch(() => showErrorNotification());
                  }
                }}
              >
                {isEmpty ? (
                  <div className={classes.error}>Логотип обязателен к заполнению</div>
                ) : null}
              </FormikImageUpload>
            </Form>
          );
        }}
      </Formik>

      <AssetsManager
        initialAssets={shop.assets}
        assetsTitle={name}
        onRemoveHandler={(assetIndex) => {
          deleteShopAssetMutation({
            variables: {
              input: {
                shopId: _id,
                assetIndex,
              },
            },
          }).catch((e) => console.log(e));
        }}
        onReorderHandler={({ assetNewIndex, assetUrl }) => {
          updateShopAssetIndexMutation({
            variables: {
              input: {
                shopId: _id,
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
        initialValues={{ assets: [], shopId: _id }}
        onSubmit={(values, formikHelpers) => {
          showLoading();
          addShopAssetsMutation({
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

export default ShopAssets;
