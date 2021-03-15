import Button from 'components/Buttons/Button';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { useCreateProductMutation } from 'generated/apolloComponents';
import { Form, Formik } from 'formik';
import { PureQueryOptions, RefetchQueriesFunction } from '@apollo/client';
import { createProductSchema } from 'validation/productSchema';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';
import { omit } from 'lodash';

export interface CreateNewProductModalInterface {
  rubricId: string;
  refetchQueries?: (string | PureQueryOptions)[] | RefetchQueriesFunction;
}

const CreateNewProductModal: React.FC<CreateNewProductModalInterface> = ({
  rubricId,
  refetchQueries,
}) => {
  const validationSchema = useValidationSchema({
    schema: createProductSchema,
  });

  const { onErrorCallback, onCompleteCallback, hideModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const [createProductMutation] = useCreateProductMutation({
    awaitRefetchQueries: true,
    refetchQueries,
    onCompleted: (data) => onCompleteCallback(data.createProduct),
    onError: onErrorCallback,
  });

  const initialValues: ProductFormValuesInterface = {
    active: true,
    nameI18n: {},
    originalName: '',
    descriptionI18n: {},
    rubricId,
    attributes: [],
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
                attributes: values.attributes.map((productAttribute) => {
                  return omit(productAttribute, ['attribute', '__typename', 'attributeName']);
                }),
                assets: values.assets || [],
              },
            },
          });
        }}
      >
        {() => {
          return (
            <Form>
              <FormikDropZone
                tooltip={'Подсказка для загрузки изображения'}
                label={'Изображения'}
                name={'assets'}
                testId={'product-images'}
                isRequired
                showInlineError
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

export default CreateNewProductModal;
