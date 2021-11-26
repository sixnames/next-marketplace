import Accordion from 'components/Accordion';
import Button from 'components/button/Button';
import InputLine from 'components/FormElements/Input/InputLine';
import { ProductFormValuesInterface } from 'components/FormTemplates/ProductMainFields';
import Inner from 'components/Inner';
import WpImage from 'components/WpImage';
import { DEFAULT_CITY } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { ProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateProductCardContentInput,
  useUpdateProductCardContentMutation,
} from 'generated/apolloComponents';
import { useUpdateProduct } from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { updateProductSchema } from 'validation/productSchema';

export interface CompanyProductDetailsInterface {
  product: ProductInterface;
  routeBasePath: string;
}

const CompanyProductDetails: React.FC<CompanyProductDetailsInterface> = ({ product, children }) => {
  const { cities } = useConfigContext();
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductMutation] = useUpdateProduct();

  const [updateProductCardContentMutation] = useUpdateProductCardContentMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCardContent),
    onError: onErrorCallback,
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

      <div className='mt-16'>
        <InputLine labelTag={'div'} label={'Контет карточки товара'}>
          <Formik<UpdateProductCardContentInput>
            initialValues={{} as any}
            onSubmit={(values) => {
              showLoading();
              updateProductCardContentMutation({
                variables: {
                  input: values,
                },
              }).catch(console.log);
            }}
          >
            {() => {
              return (
                <Form>
                  {cities.map(({ name, slug }) => {
                    const cityTestId = `${product.slug}-${slug}`;

                    return (
                      <Accordion
                        isOpen={slug === DEFAULT_CITY}
                        testId={cityTestId}
                        title={`${name}`}
                        key={slug}
                      >
                        <div className='ml-8 pt-[var(--lineGap-200)]'>{slug}</div>
                      </Accordion>
                    );
                  })}
                  <div className='flex mb-12 mt-4'>
                    <Button size={'small'} type={'submit'} testId={`card-content-submit`}>
                      Сохранить
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </InputLine>
      </div>
    </Inner>
  );
};

export default CompanyProductDetails;
