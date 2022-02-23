import { ConsoleShopLayoutInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  useDeleteShopAssetMutation,
  useUpdateShopAssetIndexMutation,
} from 'generated/apolloComponents';
import { alwaysArray } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import AssetsManager from '../AssetsManager';
import FormikImageUpload from '../FormElements/Upload/FormikImageUpload';
import WpDropZone from '../FormElements/Upload/WpDropZone';
import Inner from '../Inner';
import ConsoleShopLayout from '../layout/console/ConsoleShopLayout';

export type ShopAssetsInterface = ConsoleShopLayoutInterface;

const ShopAssets: React.FC<ShopAssetsInterface> = ({ shop, breadcrumbs }) => {
  const router = useRouter();
  const { _id, logo, name } = shop;
  const { hideLoading, onErrorCallback, showErrorNotification, onCompleteCallback, showLoading } =
    useMutationCallbacks({ reload: true });

  const [deleteShopAssetMutation] = useDeleteShopAssetMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteShopAsset),
  });

  const [updateShopAssetIndexMutation] = useUpdateShopAssetIndexMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShopAssetIndex),
  });

  return (
    <ConsoleShopLayout shop={shop} breadcrumbs={breadcrumbs}>
      <Inner>
        <div data-cy={'shop-assets-list'}>
          <Formik
            enableReinitialize
            initialValues={{ logo: [logo] }}
            onSubmit={(values) => console.log(values)}
          >
            {({ values: { logo } }) => {
              const isEmpty = !logo || !logo.length;

              return (
                <Form>
                  <FormikImageUpload
                    label={'Логотип магазина'}
                    name={'logo'}
                    testId={'logo'}
                    width={'10rem'}
                    height={'10rem'}
                    format={'image/png'}
                    setImageHandler={(files) => {
                      if (files) {
                        showLoading();
                        const formData = new FormData();
                        formData.append('assets', files[0]);
                        formData.append('shopId', `${shop._id}`);

                        fetch('/api/shops/update-shop-logo', {
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
                      <div className='mt-4 font-medium text-red-500'>
                        Логотип обязателен к заполнению
                      </div>
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

          <WpDropZone
            label={'Добавить изображения'}
            testId={'assets'}
            onDropHandler={(acceptedFiles) => {
              if (acceptedFiles) {
                showLoading();
                const formData = new FormData();
                alwaysArray(acceptedFiles).forEach((file, index) => {
                  formData.append(`assets[${index}]`, file);
                });
                formData.append('shopId', `${_id}`);

                fetch('/api/shops/add-shop-asset', {
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
        </div>
      </Inner>
    </ConsoleShopLayout>
  );
};

export default ShopAssets;
