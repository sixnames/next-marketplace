import * as React from 'react';
import { Form, Formik } from 'formik';
import {
  AddressInput,
  AddShopToCompanyInput,
  useAddShopToCompanyMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { phoneToRaw } from '../../lib/phoneUtils';
import { addShopToCompanySchema } from '../../validation/companySchema';
import WpButton from '../button/WpButton';
import ShopMainFields from '../FormTemplates/ShopMainFields';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface CreateShopModalInterface {
  companyId: string;
}

export interface CreateShopFieldsInterface extends Omit<AddShopToCompanyInput, 'address'> {
  address?: AddressInput | null;
}

const CreateShopModal: React.FC<CreateShopModalInterface> = ({ companyId }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showErrorNotification } =
    useMutationCallbacks({ withModal: true, reload: true });
  const [addShopToCompanyMutation] = useAddShopToCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.addShopToCompany),
    onError: onErrorCallback,
  });
  const validationSchema = useValidationSchema({
    schema: addShopToCompanySchema,
  });

  const initialValues: CreateShopFieldsInterface = {
    companyId,
    name: '',
    citySlug: '',
    address: null,
    contacts: {
      emails: [''],
      phones: [''],
    },
  };

  return (
    <ModalFrame testId={'create-shop-modal'}>
      <ModalTitle>Создание магазина</ModalTitle>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          if (!values.address) {
            showErrorNotification({
              title: 'Укажите адрес магазина',
            });
            return;
          }

          showLoading();
          addShopToCompanyMutation({
            variables: {
              input: {
                ...values,
                companyId,
                address: values.address!,
                contacts: {
                  ...values.contacts,
                  phones: values.contacts.phones.map((phone) => phoneToRaw(phone)),
                },
              },
            },
          }).catch(() => {
            showErrorNotification();
          });
        }}
      >
        {() => {
          return (
            <Form>
              <ShopMainFields />

              <WpButton type={'submit'} testId={'shop-submit'}>
                Создать
              </WpButton>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateShopModal;
