import Button from 'components/Button';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { DEFAULT_LOCALE, GENDER_IT, ROUTE_CMS } from 'config/common';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  useCreateProductWithSyncErrorMutation,
  useGetAllRubricsQuery,
} from 'generated/apolloComponents';
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
  const router = useRouter();
  const { data, error, loading } = useGetAllRubricsQuery({
    fetchPolicy: 'network-only',
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

  const [createProductWithSyncErrorMutation] = useCreateProductWithSyncErrorMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data.createProductWithSyncError.success) {
        onCompleteCallback(data.createProductWithSyncError);
        router
          .push(
            `${ROUTE_CMS}/rubrics/${data.createProductWithSyncError.payload?.rubricId}/products/product/${data.createProductWithSyncError.payload?._id}`,
          )
          .catch((e) => console.log(e));
      } else {
        hideLoading();
        showErrorNotification({
          title: data.createProductWithSyncError.message,
        });
      }
    },
    onError: onErrorCallback,
  });

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
          showLoading();

          return createProductWithSyncErrorMutation({
            variables: {
              input: {
                available: notSyncedProduct.available,
                price: notSyncedProduct.price,
                shopId: notSyncedProduct.shopId,
                productFields: {
                  ...values,
                  rubricId: `${values.rubricId}`,
                  barcode: (values.barcode || []).filter((currentBarcode) => {
                    return Boolean(currentBarcode);
                  }),
                },
              },
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
