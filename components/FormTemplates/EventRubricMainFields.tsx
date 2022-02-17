import { useConstantOptions } from 'hooks/useConstantOptions';
import * as React from 'react';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';

const EventRubricMainFields: React.FC = () => {
  const { genderOptions } = useConstantOptions();

  return (
    <React.Fragment>
      <FormikCheckboxLine label={'С заглавной буквы в заголовке'} name={'capitalise'} />

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
        name={'defaultTitleI18n'}
        testId={'defaultTitleI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Префикс заголовка каталога'}
        name={'prefixI18n'}
        testId={'prefixI18n'}
      />

      <FormikTranslationsInput
        label={'Ключевое слово заголовка каталога'}
        name={'keywordI18n'}
        testId={'keywordI18n'}
        showInlineError
        isRequired
      />

      <FormikSelect
        firstOption
        name={`gender`}
        label={'Род ключевого слова'}
        testId={'gender'}
        showInlineError
        isRequired
        options={genderOptions}
      />
    </React.Fragment>
  );
};

export default EventRubricMainFields;
