import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import TextSeoInfo from 'components/TextSeoInfo';
import { RubricSeoModel } from 'db/dbModels';
import { CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { UpdateRubricInput, useUpdateRubricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { updateRubricSchema } from 'validation/rubricSchema';

export interface CompanyRubricDetailsInterface {
  rubric: RubricInterface;
  seoTop?: RubricSeoModel | null;
  seoBottom?: RubricSeoModel | null;
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
}

const CompanyRubricDetails: React.FC<CompanyRubricDetailsInterface> = ({
  rubric,
  seoTop,
  seoBottom,
  currentCompany,
}) => {
  const validationSchema = useValidationSchema({
    schema: updateRubricSchema,
  });
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [updateRubricMutation] = useUpdateRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateRubric),
    onError: onErrorCallback,
  });

  const {
    _id = '',
    active,
    variantId,
    descriptionI18n,
    shortDescriptionI18n,
    nameI18n,
    capitalise,
    showRubricNameInProductTitle,
    showCategoryInProductTitle,
    showBrandInNav,
    showBrandInFilter,
    seoDescriptionTop,
    seoDescriptionBottom,
    defaultTitleI18n,
    prefixI18n,
    keywordI18n,
    gender,
  } = rubric;

  const initialValues: UpdateRubricInput = {
    rubricId: _id,
    active,
    nameI18n,
    descriptionI18n,
    shortDescriptionI18n,
    textBottomI18n: seoDescriptionBottom?.textI18n || {},
    textTopI18n: seoDescriptionTop?.textI18n || {},
    companySlug: `${currentCompany?.slug}`,
    capitalise: capitalise || false,
    showRubricNameInProductTitle: showRubricNameInProductTitle || false,
    showCategoryInProductTitle: showCategoryInProductTitle || false,
    showBrandInNav: showBrandInNav || false,
    showBrandInFilter: showBrandInFilter || false,
    defaultTitleI18n,
    prefixI18n,
    keywordI18n,
    gender: gender as any,
    variantId,
  };

  return (
    <Inner testId={'rubric-details'}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          showLoading();
          return updateRubricMutation({
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
                <Button type={'submit'} testId={'rubric-submit'}>
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

export default CompanyRubricDetails;
