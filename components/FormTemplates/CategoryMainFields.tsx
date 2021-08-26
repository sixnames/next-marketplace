import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import InputLine from 'components/FormElements/Input/InputLine';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { getConstantTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';
import { useFormikContext } from 'formik';
import { CreateCategoryInput, useGetGenderOptionsQuery } from 'generated/apolloComponents';
import * as React from 'react';

const CategoryMainFields: React.FC = () => {
  const { values } = useFormikContext<CreateCategoryInput>();
  const { locale } = useLocaleContext();
  const { data, loading, error } = useGetGenderOptionsQuery();
  if (error || (!loading && !data)) {
    return <RequestError />;
  }

  if (loading) {
    return <Spinner isTransparent isNested />;
  }

  const { getGenderOptions } = data!;

  return (
    <React.Fragment>
      <FormikTranslationsInput
        name={'nameI18n'}
        testId={'nameI18n'}
        showInlineError
        label={'Название'}
        isRequired
      />

      <FormikSelect
        name={'gender'}
        firstOption
        options={getGenderOptions}
        testId={`gender`}
        label={'Род названия'}
      />

      <InputLine name={'variants'} label={'Склонение названия по родам'} labelTag={'div'}>
        {Object.keys(values.variants).map((gender) => {
          return (
            <FormikTranslationsInput
              key={gender}
              name={`variants.${gender}`}
              label={getConstantTranslation(`selectsOptions.gender.${gender}.${locale}`)}
              testId={`variant-${gender}`}
              showInlineError
            />
          );
        })}
      </InputLine>
    </React.Fragment>
  );
};

export default CategoryMainFields;
