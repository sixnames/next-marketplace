import WpButton from 'components/button/WpButton';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import SeoContentEditor from 'components/SeoContentEditor';
import { GENDER_ENUMS } from 'config/common';
import { OptionVariantsModel } from 'db/dbModels';
import { CategoryInterface, CompanyInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { updateCategorySchema } from 'validation/categorySchema';

export interface CompanyRubricCategoryDetailsInterface {
  category: CategoryInterface;
  pageCompany: CompanyInterface;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
  routeBasePath: string;
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
              <SeoContentEditor label={'SEO текст вверху каталога'} filedName={'textTop'} />
              <SeoContentEditor label={'SEO текст внизу каталога'} filedName={'textBottom'} />

              <FixedButtons>
                <WpButton type={'submit'} testId={'category-submit'} size={'small'}>
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

export default CompanyRubricCategoryDetails;
