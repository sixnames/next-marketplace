import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import SeoTextEditor from 'components/SeoTextEditor';
import { CompanyInterface, RubricInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { UpdateRubricInput, useUpdateRubricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { updateRubricSchema } from 'validation/rubricSchema';

export interface CompanyRubricDetailsInterface {
  rubric: RubricInterface;
  pageCompany: CompanyInterface;
  routeBasePath: string;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
}

const CompanyRubricDetails: React.FC<CompanyRubricDetailsInterface> = ({
  rubric,
  pageCompany,
  seoDescriptionBottom,
  seoDescriptionTop,
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
    textBottom: seoDescriptionBottom || {},
    textTop: seoDescriptionTop || {},
    companySlug: `${pageCompany?.slug}`,
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
              <SeoTextEditor label={'SEO текст вверху каталога'} filedName={'textTop'} />
              <SeoTextEditor label={'SEO текст внизу каталога'} filedName={'textBottom'} />

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
