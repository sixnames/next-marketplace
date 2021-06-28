import Button from 'components/Button';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { DEFAULT_LOCALE } from 'config/common';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { useCreateProductMutation } from 'generated/apolloComponents';
import { Form, Formik } from 'formik';
import { createProductSchema } from 'validation/productSchema';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';

interface InitialValuesInterface extends ProductFormValuesInterface {
  rubricId?: string;
}

export interface CreateNewProductModalInterface {
  notSyncedProduct: NotSyncedProductInterface;
}

const CreateNewProductFromErrorModal: React.FC<CreateNewProductModalInterface> = ({
  notSyncedProduct,
}) => {
  const validationSchema = useValidationSchema({
    schema: createProductSchema,
  });

  const {
    onErrorCallback,
    onCompleteCallback,
    hideModal,
    showLoading,
    showErrorNotification,
    hideLoading,
  } = useMutationCallbacks({
    reload: true,
  });

  const [createProductMutation] = useCreateProductMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data.createProduct.success) {
        onCompleteCallback(data.createProduct);
      } else {
        hideLoading();
        showErrorNotification({ title: data.createProduct.message });
      }
    },
    onError: onErrorCallback,
  });

  const initialValues: InitialValuesInterface = {
    active: true,
    nameI18n: {
      [DEFAULT_LOCALE]: notSyncedProduct.name,
    },
    originalName: notSyncedProduct.name,
    descriptionI18n: {
      [DEFAULT_LOCALE]: '',
    },
    barcode: [notSyncedProduct.barcode],
    rubricId: undefined,
  };

  return (
    <ModalFrame testId={'create-new-product-modal'}>
      <ModalTitle>Создание товара</ModalTitle>
      <Formik<InitialValuesInterface>
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          if (!values.rubricId) {
            showErrorNotification({
              title: 'Рубрика не выбрана',
            });
            return;
          }
          showLoading();
          return createProductMutation({
            variables: {
              input: {
                ...values,
                rubricId: `${values.rubricId}`,
                barcode: (values.barcode || []).filter((currentBarcode) => {
                  return Boolean(currentBarcode);
                }),
              },
            },
          });
        }}
      >
        {() => {
          return (
            <Form>
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

export default CreateNewProductFromErrorModal;
