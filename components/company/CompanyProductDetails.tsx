import Button from 'components/button/Button';
import ConsoleRubricProductConstructor, {
  ConsoleRubricProductConstructorInterface,
} from 'components/console/ConsoleRubricProductConstructor';
import { ProductFormValuesInterface } from 'components/FormTemplates/ProductMainFields';
import Inner from 'components/Inner';
import WpImage from 'components/WpImage';
import { Form, Formik } from 'formik';
import { useUpdateProduct } from 'hooks/mutations/useProductMutations';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { updateProductSchema } from 'validation/productSchema';

export interface CompanyProductDetailsInterface extends ConsoleRubricProductConstructorInterface {
  routeBasePath: string;
}

const CompanyProductDetails: React.FC<CompanyProductDetailsInterface> = ({
  product,
  children,
  cardContent,
  companySlug,
}) => {
  const [updateProductMutation] = useUpdateProduct();
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });

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
      <div className='relative w-[15rem] h-[15rem] mb-8'>
        <WpImage
          url={mainImage}
          alt={originalName}
          title={originalName}
          width={120}
          className='absolute inset-0 w-full h-full object-contain'
        />
      </div>

      {children}

      <Formik<ProductFormValuesInterface>
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
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
              <Button testId={'submit-product'} type={'submit'} size={'small'}>
                Сохранить
              </Button>
            </Form>
          );
        }}
      </Formik>

      <ConsoleRubricProductConstructor
        product={product}
        cardContent={cardContent}
        companySlug={companySlug}
      />
    </Inner>
  );
};

export default CompanyProductDetails;
