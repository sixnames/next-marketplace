import * as React from 'react';
import { Form, Formik } from 'formik';
import useSWR from 'swr';
import { DEFAULT_LOCALE, GENDER_IT } from '../../config/common';
import { NotSyncedProductInterface, RubricInterface } from '../../db/uiInterfaces';
import { useCreateProductWithSyncError } from '../../hooks/mutations/useProductMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import ProductMainFields, { ProductFormValuesInterface } from '../FormTemplates/ProductMainFields';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

interface InitialValuesInterface extends ProductFormValuesInterface {
  rubricId?: string;
}

export interface CreateProductWithSyncErrorModalInterface {
  notSyncedProduct: NotSyncedProductInterface;
  companySlug: string;
}

const CreateProductWithSyncErrorModal: React.FC<CreateProductWithSyncErrorModalInterface> = ({
  notSyncedProduct,
}) => {
  const { data, error } = useSWR<RubricInterface[]>('/api/rubrics');

  const { hideModal, showErrorNotification } = useMutationCallbacks({
    withModal: true,
  });

  const [createProductWithSyncErrorMutation] = useCreateProductWithSyncError();

  if (!data && error) {
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки рубрик</ModalTitle>
      </ModalFrame>
    );
  }

  if (!data && !error) {
    return (
      <ModalFrame>
        <Spinner isNested isTransparent />
      </ModalFrame>
    );
  }

  if (!data) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const initialValues: InitialValuesInterface = {
    active: true,
    nameI18n: {
      [DEFAULT_LOCALE]: notSyncedProduct.name,
    },
    originalName: notSyncedProduct.name,
    descriptionI18n: {
      [DEFAULT_LOCALE]: '',
    },
    barcode: notSyncedProduct.barcode || [],
    rubricId: undefined,
    gender: GENDER_IT as any,
  };

  return (
    <ModalFrame testId={'create-product-with-sync-error-modal'}>
      <ModalTitle>Создание товара</ModalTitle>
      <Formik<InitialValuesInterface>
        initialValues={initialValues}
        onSubmit={(values) => {
          if (!values.rubricId) {
            showErrorNotification({
              title: 'Рубрика не выбрана',
            });
            return;
          }

          return createProductWithSyncErrorMutation({
            available: notSyncedProduct.available,
            price: notSyncedProduct.price,
            shopId: `${notSyncedProduct.shopId}`,
            productFields: {
              ...values,
              rubricId: `${values.rubricId}`,
              barcode: (values.barcode || []).filter((currentBarcode) => {
                return Boolean(currentBarcode);
              }),
            },
          });
        }}
      >
        {() => {
          return (
            <Form>
              <FormikSelect
                label={'Рубрика'}
                testId={'rubricId'}
                name={'rubricId'}
                firstOption
                options={data}
                useIdField
                isRequired
              />

              <ProductMainFields />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-new-product'}>
                  Создать
                </WpButton>
                <WpButton theme={'secondary'} onClick={hideModal} testId={'product-decline'}>
                  Отмена
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateProductWithSyncErrorModal;
