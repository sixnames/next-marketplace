import { useFormikContext } from 'formik';
import * as React from 'react';
import { AddOptionToGroupInput, OptionsGroupVariant } from '../../generated/apolloComponents';
import { useConstantOptions } from '../../hooks/useConstantOptions';
import { OPTIONS_GROUP_VARIANT_COLOR } from '../../lib/config/common';
import { getConstantTranslation } from '../../lib/config/constantTranslations';
import { useLocaleContext } from '../context/localeContext';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import InputLine from '../FormElements/Input/InputLine';
import FormikSelect from '../FormElements/Select/FormikSelect';

export interface OptionMainFieldsInterface {
  groupVariant: OptionsGroupVariant;
}

const OptionMainFields: React.FC<OptionMainFieldsInterface> = ({ groupVariant }) => {
  const { values } = useFormikContext<AddOptionToGroupInput>();
  const { locale } = useLocaleContext();
  const { genderOptions } = useConstantOptions();

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
        options={genderOptions}
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
