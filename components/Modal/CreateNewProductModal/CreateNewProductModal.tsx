import Button from 'components/Buttons/Button';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import {
  CreateProductMutation,
  useCreateProductMutation,
  useGetAllRubricsQuery,
} from 'generated/apolloComponents';
import { Form, Formik } from 'formik';
import { MutationUpdaterFn, PureQueryOptions, RefetchQueriesFunction } from '@apollo/client';
import { createProductSchema } from 'validation/productSchema';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';

export interface CreateNewProductModalInterface {
  rubricId?: string;
  update?: MutationUpdaterFn<CreateProductMutation>;
  refetchQueries?: (string | PureQueryOptions)[] | RefetchQueriesFunction;
}

const CreateNewProductModal: React.FC<CreateNewProductModalInterface> = ({
  rubricId,
  update,
  refetchQueries,
}) => {
  const validationSchema = useValidationSchema({
    schema: createProductSchema,
  });

  const { data, loading, error } = useGetAllRubricsQuery({
    skip: Boolean(rubricId),
    fetchPolicy: 'network-only',
  });

  const { onErrorCallback, onCompleteCallback, hideModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const [createProductMutation] = useCreateProductMutation({
    awaitRefetchQueries: true,
    refetchQueries,
    update,
    onCompleted: (data) => onCompleteCallback(data.createProduct),
    onError: onErrorCallback,
  });

  if (loading && !rubricId) {
    return <Spinner />;
  }

  if ((error || !data || !data.getAllRubrics) && !rubricId) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

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

              <ProductMainFields rubrics={data?.getAllRubrics} />

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
