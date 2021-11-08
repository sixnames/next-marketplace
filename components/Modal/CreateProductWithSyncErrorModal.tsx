import Button from 'components/button/Button';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { DEFAULT_LOCALE, GENDER_IT } from 'config/common';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import { useCreateProductWithSyncError } from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';
import { useGetAllRubricsQuery } from 'generated/apolloComponents';
import { Form, Formik } from 'formik';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';

interface InitialValuesInterface extends ProductFormValuesInterface {
  rubricId?: string;
}

export interface CreateProductWithSyncErrorModalInterface {
  notSyncedProduct: NotSyncedProductInterface;
  companySlug: string;
}

const CreateProductWithSyncErrorModal: React.FC<CreateProductWithSyncErrorModalInterface> = ({
  notSyncedProduct,
  companySlug,
}) => {
  const { data, error, loading } = useGetAllRubricsQuery({
    fetchPolicy: 'network-only',
  });

  const { hideModal, showErrorNotification } = useMutationCallbacks({
    withModal: true,
  });

  const [createProductWithSyncErrorMutation] = useCreateProductWithSyncError();

  if (loading) {
    return (
      <ModalFrame>
        <Spinner isNested isTransparent />
      </ModalFrame>
    );
  }

  if (error || !data || !data.getAllRubrics) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  if (!data && !loading && !error) {
    return (
      <ModalFrame>
        <ModalTitle>Ошибка загрузки рубрик</ModalTitle>
      </ModalFrame>
    );
  }

  const { getAllRubrics } = data;

  const initialValues: InitialValuesInterface = {
    companySlug,
    active: true,
    nameI18n: {
      [DEFAULT_LOCALE]: notSyncedProduct.name,
    },
    originalName: notSyncedProduct.name,
    descriptionI18n: {
      [DEFAULT_LOCALE]: '',
    },
    cardDescriptionI18n: {},
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
                options={getAllRubrics}
                useIdField
                isRequired
              />

              <ProductMainFields />

              <ModalButtons>
                <Button type={'submit'} testId={'submit-new-product'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal} testId={'product-decline'}>
                  Отмена
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateProductWithSyncErrorModal;
