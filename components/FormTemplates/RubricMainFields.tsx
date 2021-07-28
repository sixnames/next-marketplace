import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { useGetAllRubricVariantsQuery } from 'generated/apolloComponents';
import * as React from 'react';

const RubricMainFields: React.FC = () => {
  const { data, loading, error } = useGetAllRubricVariantsQuery();

  if (loading) {
    return <Spinner isNested isTransparent />;
  }
  if (error || !data) {
    return <RequestError />;
  }

  return (
    <React.Fragment>
      <FormikTranslationsInput
        label={'Название'}
        name={'nameI18n'}
        testId={'nameI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Описание'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Короткое писание'}
        name={'shortDescriptionI18n'}
        testId={'shortDescriptionI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Заголовок каталога'}
        name={'catalogueTitle.defaultTitleI18n'}
        testId={'catalogueTitle-defaultTitleI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Префикс заголовка каталога'}
        name={'catalogueTitle.prefixI18n'}
        testId={'catalogueTitle-prefixI18n'}
      />

      <FormikTranslationsInput
        label={'Ключевое слово заголовка каталога'}
        name={'catalogueTitle.keywordI18n'}
        testId={'catalogueTitle-keywordI18n'}
        showInlineError
        isRequired
      />

      <FormikSelect
        firstOption={'Не назначено'}
        name={`catalogueTitle.gender`}
        label={'Род ключевого слова'}
        testId={'catalogueTitle-gender'}
        showInlineError
        isRequired
        options={data.getGenderOptions}
      />

      <FormikSelect
        isRequired
        showInlineError
        firstOption={'Не выбран'}
        label={'Тип рубрики'}
        name={'variantId'}
        testId={'variantId'}
        options={data.getAllRubricVariants}
      />

      <FormikCheckboxLine label={'С заглавной буквы в заголовке'} name={'capitalise'} />
    </React.Fragment>
  );
};

export default RubricMainFields;
