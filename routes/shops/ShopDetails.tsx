import Button from 'components/Buttons/Button';
import ShopMainFields from 'components/FormTemplates/ShopMainFields';
import Inner from 'components/Inner/Inner';
import { Form, Formik } from 'formik';
import { UpdateShopInput, useUpdateShopMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import { phoneToRaw } from 'lib/phoneUtils';
import * as React from 'react';
import { updateShopSchema } from 'validation/shopSchema';

export type ShopDetailsInterface = AppShopLayoutInterface;

const ShopDetails: React.FC<ShopDetailsInterface> = ({ shop, basePath }) => {
  const {
    showLoading,
    onCompleteCallback,
    onErrorCallback,
    showErrorNotification,
  } = useMutationCallbacks({
    reload: true,
  });
  const [updateShopMutation] = useUpdateShopMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShop),
  });
  const validationSchema = useValidationSchema({
    schema: updateShopSchema,
  });

  const initialValues: UpdateShopInput = {
    name: shop.name,
    shopId: shop._id,
    citySlug: shop.citySlug,
    contacts: {
      emails: shop.contacts.emails[0] ? shop.contacts.emails : [''],
      phones: shop.contacts.phones[0] ? shop.contacts.phones : [''],
    },
    address: {
      formattedAddress: shop.address.formattedAddress,
      point: {
        lat: shop.address.point.coordinates[1],
        lng: shop.address.point.coordinates[0],
      },
    },
  };

  return (
    <AppShopLayout shop={shop} basePath={basePath}>
      <Inner>
        <div data-cy={'shop-details'}>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={initialValues}
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
                    ...values,
                    contacts: {
                      ...values.contacts,
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

                  <Button type={'submit'} testId={'shop-submit'}>
                    Сохранить
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Inner>
    </AppShopLayout>
  );
};

export default ShopDetails;
