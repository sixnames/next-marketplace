import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import InputLine from 'components/FormElements/Input/InputLine';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { OPTIONS_GROUP_VARIANT_COLOR } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';
import { useFormikContext } from 'formik';
import {
  AddOptionToGroupInput,
  OptionsGroupVariant,
  useGetGenderOptionsQuery,
} from 'generated/apolloComponents';
import * as React from 'react';

export interface OptionMainFieldsInterface {
  groupVariant: OptionsGroupVariant;
}

const OptionMainFields: React.FC<OptionMainFieldsInterface> = ({ groupVariant }) => {
  const { values } = useFormikContext<AddOptionToGroupInput>();
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
        testId={`option-gender`}
        label={'Род названия'}
      />

      <FormikInput
        label={'Цвет'}
        name={'color'}
        testId={'option-color'}
        type={'color'}
        disabled={groupVariant !== OPTIONS_GROUP_VARIANT_COLOR}
        isRequired={groupVariant === OPTIONS_GROUP_VARIANT_COLOR}
        showInlineError
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

export default OptionMainFields;
