import * as React from 'react';
import { Form, Formik } from 'formik';
import { GENDER_IT } from '../../config/common';
import { ProductSummaryInterface } from '../../db/uiInterfaces';
import { useCopyProduct, useCreateProduct } from '../../hooks/mutations/useProductMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import WpButton from '../button/WpButton';
import ProductMainFields, { ProductFormValuesInterface } from '../FormTemplates/ProductMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface CreateNewProductModalInterface {
  rubricId: string;
  product?: ProductSummaryInterface | null;
}

const CreateNewProductModal: React.FC<CreateNewProductModalInterface> = ({ rubricId, product }) => {
  const { hideModal } = useMutationCallbacks({
    withModal: true,
  });

  const [createProductMutation] = useCreateProduct();
  const [copyProductMutation] = useCopyProduct();

  const initialValues: ProductFormValuesInterface = {
    active: true,
    nameI18n: product?.nameI18n || {},
    originalName: product?.originalName || '',
    descriptionI18n: product?.descriptionI18n || {},
    barcode: [],
    gender: GENDER_IT as any,
  };

  return (
    <ModalFrame testId={'create-new-product-modal'}>
      <ModalTitle>Создание товара</ModalTitle>
      <Formik<ProductFormValuesInterface>
        initialValues={initialValues}
        onSubmit={(values) => {
          if (product) {
            copyProductMutation({
              ...values,
              productId: `${product._id}`,
              rubricId: `${product.rubricId}`,
              barcode: (values.barcode || []).filter((currentBarcode) => {
                return Boolean(currentBarcode);
              }),
            }).catch(console.log);
            return;
          }

          createProductMutation({
            ...values,
            rubricId,
            barcode: (values.barcode || []).filter((currentBarcode) => {
              return Boolean(currentBarcode);
            }),
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
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

export default CreateNewProductModal;
