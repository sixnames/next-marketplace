import WpButton from 'components/button/WpButton';
import ShopMainFields from 'components/FormTemplates/ShopMainFields';
import { phoneToRaw } from 'lib/phoneUtils';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import useValidationSchema from 'hooks/useValidationSchema';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import {
  AddressInput,
  AddShopToCompanyInput,
  useAddShopToCompanyMutation,
} from 'generated/apolloComponents';
import { addShopToCompanySchema } from 'validation/companySchema';
import { Form, Formik } from 'formik';

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
