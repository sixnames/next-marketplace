import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { ProductFormValuesInterface } from 'components/FormTemplates/ProductMainFields';
import Inner from 'components/Inner';
import TextSeoInfo from 'components/TextSeoInfo';
import WpImage from 'components/WpImage';
import { CompanyInterface, ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateProductMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useReloadListener } from 'hooks/useReloadListener';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { updateProductSchema } from 'validation/productSchema';

export interface CompanyProductDetailsInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
}

const CompanyProductDetails: React.FC<CompanyProductDetailsInterface> = ({
  product,
  currentCompany,
}) => {
  const { setReloadToTrue } = useReloadListener();
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductMutation] = useUpdateProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      setReloadToTrue();
      onCompleteCallback(data.updateProduct);
    },
  });

  const {
    nameI18n,
    originalName,
    descriptionI18n,
    active,
    mainImage,
    barcode,
    gender,
    cardDescription,
  } = product;

  const initialValues: ProductFormValuesInterface = {
    productId: `${product._id}`,
    nameI18n: nameI18n || {},
    originalName,
    descriptionI18n,
    active,
    barcode: barcode || [],
    gender: gender as any,
    cardDescriptionI18n: cardDescription?.textI18n || {},
    companySlug: `${currentCompany?.slug}`,
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
            variables: {
              input: {
                ...values,
                productId: product._id,
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
            <Form noValidate>
              <div className='relative w-[15rem] h-[15rem] mb-8'>
                <WpImage
                  url={mainImage}
                  alt={originalName}
                  title={originalName}
                  width={120}
                  className='absolute inset-0 w-full h-full object-contain'
                />
              </div>

              <FormikTranslationsInput
                variant={'textarea'}
                className='h-[30rem]'
                label={'Описание карточки товара'}
                name={'cardDescriptionI18n'}
                testId={'cardDescriptionI18n'}
                additionalUi={(currentLocale) => {
                  if (!cardDescription?.seo) {
                    return null;
                  }
                  const seoLocale = cardDescription.seo.locales.find(({ locale }) => {
                    return locale === currentLocale;
                  });

                  if (!seoLocale) {
                    return <div className='mb-4 font-medium'>Текст проверяется</div>;
                  }

                  return (
                    <TextSeoInfo
                      seoLocale={seoLocale}
                      className='mb-4 mt-4'
                      listClassName='flex gap-3 flex-wrap'
                    />
                  );
                }}
              />

              <FixedButtons>
                <Button testId={'submit-product'} type={'submit'}>
                  Сохранить
                </Button>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default CompanyProductDetails;
