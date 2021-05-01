import AssetsManager from 'components/Assets/AssetsManager';
import Button from 'components/Buttons/Button';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import InnerWide from 'components/Inner/InnerWide';
import { Form, Formik } from 'formik';
import {
  ShopFragment,
  useDeleteShopAssetMutation,
  useUpdateShopAssetIndexMutation,
} from 'generated/apolloComponents';
import { SHOP_QUERY } from 'graphql/query/companiesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useRouter } from 'next/router';
import classes from './ShopAssets.module.css';
import * as React from 'react';

interface ShopAssetsInterface {
  shop: ShopFragment;
}

const ShopAssets: React.FC<ShopAssetsInterface> = ({ shop }) => {
  const router = useRouter();
  const { _id, slug, logo, name } = shop;
  const {
    onErrorCallback,
    showErrorNotification,
    onCompleteCallback,
    showLoading,
    hideLoading,
  } = useMutationCallbacks({});

  const refetchQueries = [
    {
      query: SHOP_QUERY,
      variables: {
        _id,
      },
    },
  ];

  const [deleteShopAssetMutation] = useDeleteShopAssetMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteShopAsset),
    refetchQueries,
  });

  const [updateShopAssetIndexMutation] = useUpdateShopAssetIndexMutation({
    awaitRefetchQueries: true,
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
                setImageHandler={(files) => {
                  if (files) {
                    showLoading();
                    const formData = new FormData();
                    formData.append('assets', files[0]);
                    formData.append('shopId', `${shop._id}`);

                    fetch('/api/update-shop-logo', {
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
        initialValues={{ assets: [], shopId: _id }}
        onSubmit={(values) => {
          if (values.assets && values.assets.length > 0) {
            showLoading();
            const formData = new FormData();
            values.assets.forEach((file, index) => {
              formData.append(`assets[${index}]`, file);
            });
            formData.append('shopId', `${values.shopId}`);

            fetch('/api/add-shop-asset', {
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
    </InnerWide>
  );
};

export default ShopAssets;
