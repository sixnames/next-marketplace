import Button from 'components/Button';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { GENDER_IT } from 'config/common';
import { ProductInterface } from 'db/uiInterfaces';
import { useCopyProduct, useCreateProduct } from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';
import { Form, Formik } from 'formik';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';

export interface CreateNewProductModalInterface {
  rubricId: string;
  product?: ProductInterface | null;
  companySlug: string;
}

const CreateNewProductModal: React.FC<CreateNewProductModalInterface> = ({
  rubricId,
  companySlug,
  product,
}) => {
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
    cardDescriptionI18n: {},
    barcode: [],
    gender: GENDER_IT as any,
    companySlug,
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
