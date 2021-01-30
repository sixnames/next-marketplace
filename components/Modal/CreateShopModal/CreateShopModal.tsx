import Button from 'components/Buttons/Button';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import ShopMainFields from 'components/FormTemplates/ShopMainFields';
import { phoneToRaw } from 'lib/phoneUtils';
import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import useValidationSchema from '../../../hooks/useValidationSchema';
import useMutationCallbacks from '../../../hooks/useMutationCallbacks';
import {
  AddressInput,
  AddShopToCompanyInput,
  useAddShopToCompanyMutation,
} from 'generated/apolloComponents';
import { COMPANY_SHOPS_QUERY } from 'graphql/query/companiesQueries';
import { addShopToCompanySchema } from 'validation/companySchema';
import { Form, Formik } from 'formik';

export interface CreateShopModalInterface {
  companyId: string;
}

export interface CreateShopFieldsInterface extends Omit<AddShopToCompanyInput, 'address'> {
  address?: AddressInput | null;
}

const CreateShopModal: React.FC<CreateShopModalInterface> = ({ companyId }) => {
  const {
    onCompleteCallback,
    onErrorCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });
  const [addShopToCompanyMutation] = useAddShopToCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.addShopToCompany),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: COMPANY_SHOPS_QUERY,
        variables: {
          companyId: `${companyId}`,
          input: {
            page: 1,
          },
        },
      },
    ],
  });
  const validationSchema = useValidationSchema({
    schema: addShopToCompanySchema,
  });

  const initialValues: CreateShopFieldsInterface = {
    companyId,
    name: '',
    citySlug: '',
    address: null,
    logo: [],
    assets: [],
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
              <FormikImageUpload
                label={'Логотип магазина'}
                name={'logo'}
                testId={'logo'}
                showInlineError
                isRequired
              />

              <FormikDropZone
                label={'Фото магазина'}
                name={'assets'}
                testId={'assets'}
                isRequired
                showInlineError
              />

              <ShopMainFields />

              <Button type={'submit'} testId={'shop-submit'}>
                Создать
              </Button>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateShopModal;
