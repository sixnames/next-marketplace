import Accordion from 'components/Accordion';
import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import InputLine from 'components/FormElements/Input/InputLine';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import { DEFAULT_CITY, GENDER_ENUMS, REQUEST_METHOD_POST } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { OptionVariantsModel, SeoContentModel } from 'db/dbModels';
import { CategoryInterface, CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { get } from 'lodash';
import * as React from 'react';
import { updateCategorySchema } from 'validation/categorySchema';

interface CategoryDescriptionConstructorInterface {
  name: string;
  values: UpdateCategoryInput;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  label: string;
  categoryId: string;
  descriptionId: string;
}

export const CategoryDescriptionConstructor: React.FC<CategoryDescriptionConstructorInterface> = ({
  label,
  setFieldValue,
  values,
  name,
  categoryId,
  descriptionId,
}) => {
  const { cities } = useConfigContext();

  return (
    <InputLine labelTag={'div'} label={label}>
      {cities.map((city) => {
        const fieldName = `${name}.${city.slug}`;
        const fieldValue = get(values, fieldName);
        const constructorValue = getConstructorDefaultValue(fieldValue);

        return (
          <Accordion
            isOpen={city.slug === DEFAULT_CITY}
            testId={city.slug}
            title={`${city.name}`}
            key={city.slug}
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
                    formData.append('categoryId', `${categoryId}`);
                    formData.append('descriptionId', `${descriptionId}`);

                    const responseFetch = await fetch('/api/category/add-description-asset', {
                      method: REQUEST_METHOD_POST,
                      body: formData,
                    });
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
    </InputLine>
  );
};

export interface CompanyRubricCategoryDetailsInterface {
  category: CategoryInterface;
  pageCompany: CompanyInterface;
  seoDescriptionTop: SeoContentModel;
  seoDescriptionBottom: SeoContentModel;
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
    textTop: seoDescriptionTop.content,
    textBottom: seoDescriptionBottom.content,
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
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <CategoryDescriptionConstructor
                label={'SEO текст вверху каталога'}
                name={'textTop'}
                categoryId={`${category._id}`}
                descriptionId={`${seoDescriptionTop._id}`}
                setFieldValue={setFieldValue}
                values={values}
              />

              <CategoryDescriptionConstructor
                label={'SEO текст внизу каталога'}
                name={'textBottom'}
                categoryId={`${category._id}`}
                descriptionId={`${seoDescriptionBottom._id}`}
                setFieldValue={setFieldValue}
                values={values}
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
