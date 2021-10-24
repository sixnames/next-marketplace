import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import TextSeoInfo from 'components/TextSeoInfo';
import { GENDER_ENUMS } from 'config/common';
import { OptionVariantsModel, RubricSeoModel } from 'db/dbModels';
import { CategoryInterface, CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { updateCategorySchema } from 'validation/categorySchema';

export interface CompanyRubricCategoryDetailsInterface {
  category: CategoryInterface;
  seoTop?: RubricSeoModel | null;
  seoBottom?: RubricSeoModel | null;
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
}

const CompanyRubricCategoryDetails: React.FC<CompanyRubricCategoryDetailsInterface> = ({
  category,
  currentCompany,
  seoTop,
  seoBottom,
}) => {
  const validationSchema = useValidationSchema({
    schema: updateCategorySchema,
  });
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateCategoryMutation] = useUpdateCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.updateCategory),
    onError: onErrorCallback,
  });

  const {
    _id = '',
    nameI18n,
    rubricId,
    gender,
    variants,
    seoDescriptionTop,
    seoDescriptionBottom,
    replaceParentNameInCatalogueTitle,
  } = category;
  const variantKeys = Object.keys(variants);

  const initialValues: UpdateCategoryInput = {
    categoryId: _id,
    rubricId,
    nameI18n,
    textBottomI18n: seoDescriptionBottom?.textI18n,
    textTopI18n: seoDescriptionTop?.textI18n,
    gender: gender ? (`${gender}` as Gender) : null,
    replaceParentNameInCatalogueTitle,
    companySlug: `${currentCompany?.slug}`,
    variants:
      variantKeys.length > 0
        ? variants
        : GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
            acc[gender] = {};
            return acc;
          }, {}),
  };

  return (
    <Inner testId={'category-details'}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          showLoading();
          return updateCategoryMutation({
            variables: {
              input: values,
            },
          });
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                variant={'textarea'}
                className='h-[30rem]'
                label={'SEO текст вверху каталога'}
                name={'textTopI18n'}
                testId={'textTopI18n'}
                additionalUi={(currentLocale) => {
                  if (!seoTop) {
                    return null;
                  }
                  const seoLocale = seoTop.locales.find(({ locale }) => {
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

              <FormikTranslationsInput
                variant={'textarea'}
                className='h-[30rem]'
                label={'SEO текст внизу каталога'}
                name={'textBottomI18n'}
                testId={'textBottomI18n'}
                additionalUi={(currentLocale) => {
                  if (!seoBottom) {
                    return null;
                  }
                  const seoLocale = seoBottom.locales.find(({ locale }) => {
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
                <Button type={'submit'} testId={'category-submit'} size={'small'}>
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

export default CompanyRubricCategoryDetails;
