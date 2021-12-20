import { useFormikContext } from 'formik';
import * as React from 'react';
import { getConstantTranslation } from '../../config/constantTranslations';
import { useLocaleContext } from '../../context/localeContext';
import { CreateCategoryInput, useGetGenderOptionsQuery } from '../../generated/apolloComponents';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import InputLine from '../FormElements/Input/InputLine';
import FormikSelect from '../FormElements/Select/FormikSelect';
import RequestError from '../RequestError';
import Spinner from '../Spinner';

const CategoryMainFields: React.FC = () => {
  const { locale } = useLocaleContext();
  const { values } = useFormikContext<CreateCategoryInput>();
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
