import { ProductSummaryInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateProduct } from 'hooks/mutations/useProductMutations';
import { alwaysString } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updateProductSchema } from 'validation/productSchema';
import useValidationSchema from '../../hooks/useValidationSchema';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import FormikMultiLineInput from '../FormElements/Input/FormikMultiLineInput';
import ProductMainFields, { ProductFormValuesInterface } from '../FormTemplates/ProductMainFields';
import Inner from '../Inner';
import WpImage from '../WpImage';

interface ConsoleRubricProductDetailsInterface {
  product: ProductSummaryInterface;
}

const ConsoleRubricProductDetails: React.FC<ConsoleRubricProductDetailsInterface> = ({
  product,
}) => {
  const router = useRouter();
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });
  const [updateProductMutation] = useUpdateProduct();

  const { nameI18n, originalName, descriptionI18n, active, mainImage, barcode, gender, videos } =
    product;

  const initialValues: ProductFormValuesInterface = {
    productId: `${product._id}`,
    nameI18n: nameI18n || {},
    originalName,
    descriptionI18n,
    active,
    barcode: barcode || [],
    gender: gender as any,
    videos: videos || [''],
  };

  return (
    <Inner testId={'product-details'}>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          return updateProductMutation({
            ...values,
            taskId: alwaysString(router.query.taskId),
            productId: `${product._id}`,
            barcode: (values.barcode || []).filter((currentBarcode) => {
              return Boolean(currentBarcode);
            }),
          });
        }}
      >
        {() => {
          return (
            <Form noValidate>
              <div className='relative mb-8 h-[15rem] w-[15rem]'>
                <WpImage
                  url={mainImage}
                  alt={originalName}
                  title={originalName}
                  width={240}
                  className='absolute inset-0 h-full w-full object-contain'
                />
              </div>

              {/*<FormikCheckboxLine label={'Активен'} name={'active'} testId={'active'} />*/}

              <ProductMainFields />

              <FormikMultiLineInput label={'Видео'} name={'videos'} />

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
