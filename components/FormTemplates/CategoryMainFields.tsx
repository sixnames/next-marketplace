import { useFormikContext } from 'formik';
import * as React from 'react';
import { getConstantTranslation } from '../../config/constantTranslations';
import { useLocaleContext } from '../../context/localeContext';
import { CreateCategoryInput } from '../../generated/apolloComponents';
import { useConstantOptions } from '../../hooks/useConstantOptions';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import InputLine from '../FormElements/Input/InputLine';
import FormikSelect from '../FormElements/Select/FormikSelect';

const CategoryMainFields: React.FC = () => {
  const { locale } = useLocaleContext();
  const { values } = useFormikContext<CreateCategoryInput>();
  const { genderOptions } = useConstantOptions();

  return (
    <React.Fragment>
      <FormikCheckboxLine
        name={'replaceParentNameInCatalogueTitle'}
        label={'Заменять название родительской категории в заголовке каталога'}
      />

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
