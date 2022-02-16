import { UpdateRubricInputInterface } from 'db/dao/rubrics/updateRubric';
import { CompanyInterface, RubricInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateRubric } from 'hooks/mutations/useRubricMutations';
import * as React from 'react';
import { updateRubricSchema } from 'validation/rubricSchema';
import useValidationSchema from '../../hooks/useValidationSchema';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import SeoContentEditor from '../SeoContentEditor';

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

  const [updateRubricMutation] = useUpdateRubric();

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

  const initialValues: UpdateRubricInputInterface = {
    _id: `${_id}`,
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
    showBrandAsAlphabet: rubric.showBrandAsAlphabet,
    defaultTitleI18n,
    prefixI18n,
    keywordI18n,
    gender: gender as any,
    variantId: `${variantId}`,
  };

  return (
    <Inner testId={'rubric-details'}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          updateRubricMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <SeoContentEditor
                label={'SEO текст вверху каталога'}
                filedName={'textTop'}
                hideIndexCheckbox
              />
              <SeoContentEditor
                label={'SEO текст внизу каталога'}
                filedName={'textBottom'}
                hideIndexCheckbox
              />

              <FixedButtons>
                <WpButton type={'submit'} testId={'rubric-submit'}>
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

export default CompanyRubricDetails;
