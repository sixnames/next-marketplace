import { Form, Formik } from 'formik';
import * as React from 'react';
import { ProductInterface } from '../../db/uiInterfaces';
import { useUpdateProduct } from '../../hooks/mutations/useProductMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateProductSchema } from '../../validation/productSchema';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import ProductMainFields, { ProductFormValuesInterface } from '../FormTemplates/ProductMainFields';
import Inner from '../Inner';
import WpImage from '../WpImage';

interface ConsoleRubricProductDetailsInterface {
  product: ProductInterface;
  companySlug: string;
}

const ConsoleRubricProductDetails: React.FC<ConsoleRubricProductDetailsInterface> = ({
  product,
}) => {
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });
  const { showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductMutation] = useUpdateProduct();

  const { nameI18n, originalName, descriptionI18n, active, mainImage, barcode, gender } = product;

  const initialValues: ProductFormValuesInterface = {
    productId: `${product._id}`,
    nameI18n: nameI18n || {},
    originalName,
    descriptionI18n,
    active,
    barcode: barcode || [],
    gender: gender as any,
  };

  return (
    <Inner testId={'product-details'}>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          return updateProductMutation({
            ...values,
            productId: `${product._id}`,
            rubricId: `${product.rubricId}`,
            barcode: (values.barcode || []).filter((currentBarcode) => {
              return Boolean(currentBarcode);
            }),
          });
        }}
      >
        {() => {
          return (
            <Form noValidate>
              <div className='relative w-[15rem] h-[15rem] mb-8'>
                <WpImage
                  url={mainImage}
                  alt={originalName}
                  title={originalName}
                  width={240}
                  className='absolute inset-0 w-full h-full object-contain'
                />
              </div>

              {/*<FormikCheckboxLine label={'Активен'} name={'active'} testId={'active'} />*/}

              <ProductMainFields />

              <FixedButtons>
                <WpButton testId={'submit-product'} type={'submit'}>
                  Сохранить
                </WpButton>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default ConsoleRubricProductDetails;
