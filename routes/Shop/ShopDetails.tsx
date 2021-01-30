import Button from 'components/Buttons/Button';
import ShopMainFields from 'components/FormTemplates/ShopMainFields';
import { Form, Formik } from 'formik';
import { phoneToRaw } from 'lib/phoneUtils';
import * as React from 'react';
import { ShopFragment, UpdateShopInput, useUpdateShopMutation } from 'generated/apolloComponents';
import { updateShopSchema } from 'validation/shopSchema';
import Inner from '../../components/Inner/Inner';
import useValidationSchema from '../../hooks/useValidationSchema';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { SHOP_QUERY } from 'graphql/query/companiesQueries';

interface ShopDetailsInterface {
  shop: ShopFragment;
}

const ShopDetails: React.FC<ShopDetailsInterface> = ({ shop }) => {
  const {
    showLoading,
    onCompleteCallback,
    onErrorCallback,
    showErrorNotification,
  } = useMutationCallbacks();
  const [updateShopMutation] = useUpdateShopMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShop),
    refetchQueries: [
      {
        query: SHOP_QUERY,
        variables: {
          _id: shop._id,
        },
      },
    ],
  });
  const validationSchema = useValidationSchema({
    schema: updateShopSchema,
  });

  const initialValues: UpdateShopInput = {
    name: shop.name,
    shopId: shop._id,
    citySlug: shop.city.slug,
    contacts: {
      emails: shop.contacts.emails,
      phones: shop.contacts.phones,
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
    <Inner testId={'shop-details'}>
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
                  phones: values.contacts.phones.map((phone) => phoneToRaw(phone)),
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
                Создать
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default ShopDetails;
