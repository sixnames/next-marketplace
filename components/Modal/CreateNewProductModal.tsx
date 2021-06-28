import Button from 'components/Button';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { ROUTE_CMS } from 'config/common';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useCreateProductMutation } from 'generated/apolloComponents';
import { Form, Formik } from 'formik';
import { createProductSchema } from 'validation/productSchema';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';

export interface CreateNewProductModalInterface {
  rubricId: string;
}

const CreateNewProductModal: React.FC<CreateNewProductModalInterface> = ({ rubricId }) => {
  const router = useRouter();
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
    withModal: true,
  });

  const [createProductMutation] = useCreateProductMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data.createProduct.success) {
        onCompleteCallback(data.createProduct);
        router
          .push(
            `${ROUTE_CMS}/rubrics/${rubricId}/products/product/${data.createProduct.payload?._id}`,
          )
          .catch((e) => console.log(e));
      } else {
        hideLoading();
        showErrorNotification({ title: data.createProduct.message });
      }
    },
    onError: onErrorCallback,
  });

  const initialValues: ProductFormValuesInterface = {
    active: true,
    nameI18n: {},
    originalName: '',
    descriptionI18n: {},
    barcode: [],
  };

  return (
    <ModalFrame testId={'create-new-product-modal'}>
      <ModalTitle>Создание товара</ModalTitle>
      <Formik<ProductFormValuesInterface>
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          return createProductMutation({
            variables: {
              input: {
                ...values,
                rubricId,
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

export default CreateNewProductModal;
