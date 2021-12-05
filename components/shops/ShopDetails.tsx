import Button from 'components/button/Button';
import FakeInput from 'components/FormElements/Input/FakeInput';
import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import ShopMainFields from 'components/FormTemplates/ShopMainFields';
import Inner from 'components/Inner';
import { REQUEST_METHOD_DELETE, REQUEST_METHOD_POST } from 'config/common';
import { Form, Formik } from 'formik';
import {
  UpdateShopInput,
  useGenerateShopTokenMutation,
  useUpdateShopMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import ConsoleShopLayout, { AppShopLayoutInterface } from 'layout/console/ConsoleShopLayout';
import { phoneToRaw } from 'lib/phoneUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updateShopSchema } from 'validation/shopSchema';

export type ShopDetailsInterface = AppShopLayoutInterface;

const ShopDetails: React.FC<ShopDetailsInterface> = ({ shop, basePath, breadcrumbs }) => {
  const router = useRouter();
  const { showLoading, onCompleteCallback, onErrorCallback, showErrorNotification, hideLoading } =
    useMutationCallbacks({
      reload: true,
    });
  const [updateShopMutation] = useUpdateShopMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShop),
  });
  const validationSchema = useValidationSchema({
    schema: updateShopSchema,
  });

  const [generateShopTokenMutation] = useGenerateShopTokenMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.generateShopToken),
  });

  const initialValues: UpdateShopInput = {
    name: shop.name,
    shopId: shop._id,
    citySlug: shop.citySlug,
    license: shop.license,
    priceWarningI18n: shop.priceWarningI18n || {},
    contacts: {
      emails: shop.contacts.emails[0] ? shop.contacts.emails : [''],
      phones: shop.contacts.phones[0] ? shop.contacts.phones : [''],
    },
    address: {
      addressComponents: shop.address.addressComponents,
      formattedAddress: shop.address.formattedAddress,
      point: {
        lat: shop.address.point.coordinates[1],
        lng: shop.address.point.coordinates[0],
      },
    },
  };

  return (
    <ConsoleShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <Inner testId={'shop-details-page'}>
        <div className='relative'>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={{
              ...initialValues,
              mapMarker: {
                lightTheme: [shop.mapMarker?.lightTheme],
                darkTheme: [shop.mapMarker?.darkTheme],
              },
            }}
            onSubmit={(values) => {
              const { address } = values;
              if (!address) {
                showErrorNotification({
                  title: 'Укажите адрес магазина',
                });
                return;
              }

              showLoading();
              updateShopMutation({
                variables: {
                  input: {
                    address: values.address,
                    citySlug: values.citySlug,
                    name: values.name,
                    shopId: values.shopId,
                    license: values.license,
                    priceWarningI18n: values.priceWarningI18n,
                    contacts: {
                      emails: values.contacts.emails,
                      phones: values.contacts.phones.map((phone) => {
                        const rawPhone = phoneToRaw(phone);
                        return rawPhone;
                      }),
                    },
                  },
                },
              }).catch((e) => console.log(e));
            }}
          >
            {() => {
              return (
                <Form>
                  <ShopMainFields />

                  <WpImageUpload
                    previewUrl={shop.mapMarker?.lightTheme}
                    label={'Изображение маркера на карте со светлой темой (40 x 40)'}
                    testId={'light-theme-marker'}
                    width={'10rem'}
                    height={'10rem'}
                    removeImageHandler={() => {
                      showLoading();
                      const formData = new FormData();
                      formData.append('shopId', `${shop._id}`);

                      fetch('/api/shops/update-shop-marker', {
                        method: REQUEST_METHOD_DELETE,
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
                    }}
                    uploadImageHandler={(files) => {
                      if (files) {
                        showLoading();
                        const formData = new FormData();
                        formData.append('assets', files[0]);
                        formData.append('shopId', `${shop._id}`);

                        fetch('/api/shops/update-shop-marker', {
                          method: REQUEST_METHOD_POST,
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

                  <WpImageUpload
                    previewUrl={shop.mapMarker?.darkTheme}
                    label={'Изображение маркера на карте с тёмной темой (40 x 40)'}
                    testId={'dark-theme-marker'}
                    width={'10rem'}
                    height={'10rem'}
                    removeImageHandler={() => {
                      showLoading();
                      const formData = new FormData();
                      formData.append('shopId', `${shop._id}`);
                      formData.append('isDark', 'true');

                      fetch('/api/shops/update-shop-marker', {
                        method: REQUEST_METHOD_DELETE,
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
                    }}
                    uploadImageHandler={(files) => {
                      if (files) {
                        showLoading();
                        const formData = new FormData();
                        formData.append('assets', files[0]);
                        formData.append('shopId', `${shop._id}`);
                        formData.append('isDark', 'true');

                        fetch('/api/shops/update-shop-marker', {
                          method: REQUEST_METHOD_POST,
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

                  <Button type={'submit'} testId={'shop-submit'}>
                    Сохранить
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>

        <div className='mt-8'>
          <FakeInput
            testId={shop.token ? 'generated-token' : ''}
            value={shop.token}
            label={'API токен'}
          />
          {!shop.token ? (
            <Button
              onClick={() => {
                showLoading();
                generateShopTokenMutation({
                  variables: {
                    _id: shop._id,
                  },
                }).catch(console.log);
              }}
              testId={'generate-api-token'}
            >
              Сгенерировать токен
            </Button>
          ) : null}
        </div>
      </Inner>
    </ConsoleShopLayout>
  );
};

export default ShopDetails;
