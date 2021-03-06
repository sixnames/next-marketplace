import { OptionVariantsModel } from 'db/dbModels';
import { CategoryInterface, CompanyInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import { GENDER_ENUMS } from 'lib/config/common';
import * as React from 'react';
import { updateCategorySchema } from 'validation/categorySchema';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import SeoContentEditor from '../SeoContentEditor';

export interface CompanyRubricCategoryDetailsInterface {
  category: CategoryInterface;
  pageCompany: CompanyInterface;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
}

const CompanyRubricCategoryDetails: React.FC<CompanyRubricCategoryDetailsInterface> = ({
  category,
  pageCompany,
  seoDescriptionTop,
  seoDescriptionBottom,
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
    replaceParentNameInCatalogueTitle,
  } = category;
  const variantKeys = Object.keys(variants);

  const initialValues: UpdateCategoryInput = {
    categoryId: _id,
    rubricId,
    nameI18n,
    textTop: seoDescriptionTop,
    textBottom: seoDescriptionBottom,
    gender: gender ? (`${gender}` as Gender) : null,
    replaceParentNameInCatalogueTitle,
    companySlug: `${pageCompany?.slug}`,
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
              <SeoContentEditor label={'SEO ?????????? ???????????? ????????????????'} filedName={'textTop'} />
              <SeoContentEditor label={'SEO ?????????? ?????????? ????????????????'} filedName={'textBottom'} />

              <FixedButtons>
                <WpButton type={'submit'} testId={'category-submit'} size={'small'}>
                  ??????????????????
                </WpButton>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default CompanyRubricCategoryDetails;
