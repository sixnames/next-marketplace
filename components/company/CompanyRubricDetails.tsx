import Accordion from 'components/Accordion';
import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import InputLine from 'components/FormElements/Input/InputLine';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import { DEFAULT_CITY, REQUEST_METHOD_POST } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { RubricDescriptionModel } from 'db/dbModels';
import { CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { UpdateRubricInput, useUpdateRubricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { get } from 'lodash';
import * as React from 'react';
import { updateRubricSchema } from 'validation/rubricSchema';

interface RubricDescriptionConstructorInterface {
  name: string;
  values: UpdateRubricInput;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  label: string;
  rubricId: string;
  descriptionId: string;
}

export const RubricDescriptionConstructor: React.FC<RubricDescriptionConstructorInterface> = ({
  label,
  setFieldValue,
  values,
  name,
  rubricId,
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
                    formData.append('rubricId', `${rubricId}`);
                    formData.append('descriptionId', `${descriptionId}`);

                    const responseFetch = await fetch('/api/rubric/add-description-asset', {
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

export interface CompanyRubricDetailsInterface {
  rubric: RubricInterface;
  pageCompany: CompanyInterface;
  routeBasePath: string;
  seoDescriptionTop: RubricDescriptionModel;
  seoDescriptionBottom: RubricDescriptionModel;
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
    textBottom: seoDescriptionBottom.content || {},
    textTop: seoDescriptionTop.content || {},
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
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <RubricDescriptionConstructor
                name={'textTop'}
                values={values}
                setFieldValue={setFieldValue}
                label={'SEO текст вверху каталога'}
                rubricId={`${rubric._id}`}
                descriptionId={`${seoDescriptionTop._id}`}
              />

              <RubricDescriptionConstructor
                name={'textBottom'}
                values={values}
                setFieldValue={setFieldValue}
                label={'SEO текст внизу каталога'}
                rubricId={`${rubric._id}`}
                descriptionId={`${seoDescriptionBottom._id}`}
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
