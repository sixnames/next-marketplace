import Accordion from 'components/Accordion';
import Button from 'components/Button';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import InputLine from 'components/FormElements/Input/InputLine';
import { ProductFormValuesInterface } from 'components/FormTemplates/ProductMainFields';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import TextSeoInfo from 'components/TextSeoInfo';
import WpImage from 'components/WpImage';
import { DEFAULT_CITY } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { ProductCardContentModel } from 'db/dbModels';
import { CompanyInterface, ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateProductCardContentInput,
  useUpdateProductCardContentMutation,
  useUpdateProductMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useReloadListener } from 'hooks/useReloadListener';
import useValidationSchema from 'hooks/useValidationSchema';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { get } from 'lodash';
import * as React from 'react';
import { updateProductSchema } from 'validation/productSchema';

export interface CompanyProductDetailsInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
  cardContent: ProductCardContentModel;
}

const CompanyProductDetails: React.FC<CompanyProductDetailsInterface> = ({
  product,
  currentCompany,
  children,
  cardContent,
}) => {
  const { cities } = useConfigContext();
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

  const [updateProductCardContentMutation] = useUpdateProductCardContentMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCardContent),
    onError: onErrorCallback,
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

  const cardContentInitialValues: UpdateProductCardContentInput = cardContent;

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
            initialValues={cardContentInitialValues}
            onSubmit={(values) => {
              showLoading();
              updateProductCardContentMutation({
                variables: {
                  input: values,
                },
              }).catch(console.log);
            }}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form>
                  {cities.map(({ name, slug }) => {
                    const cityTestId = `${product.slug}-${slug}`;
                    const fieldName = `content.${slug}`;
                    const fieldValue = get(values, fieldName);
                    const constructorValue = getConstructorDefaultValue(fieldValue);

                    return (
                      <Accordion
                        isOpen={slug === DEFAULT_CITY}
                        testId={cityTestId}
                        title={`${name}`}
                        key={slug}
                      >
                        <div className='ml-8 pt-[var(--lineGap-200)]'>
                          <PageEditor
                            value={constructorValue}
                            setValue={(value) => {
                              setFieldValue(fieldName, JSON.stringify(value));
                            }}
                            imageUpload={async (file) => {
                              try {
                                const formData = new FormData();
                                formData.append('assets', file);
                                formData.append('productId', `${product._id}`);
                                formData.append('productCardContentId', `${cardContent._id}`);

                                const responseFetch = await fetch(
                                  '/api/product/add-card-content-asset',
                                  {
                                    method: 'POST',
                                    body: formData,
                                  },
                                );
                                const responseJson = await responseFetch.json();

                                return {
                                  url: responseJson.url,
                                };
                              } catch (e) {
                                console.log(e);
                                return {
                                  url: '',
                                };
                              }
                            }}
                          />
                        </div>
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
