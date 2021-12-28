import * as React from 'react';
import { RubricVariantInterface } from '../../db/uiInterfaces';
import { useConstantOptions } from '../../hooks/useConstantOptions';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';

export interface RubricMainFieldsInterface {
  rubricVariants: RubricVariantInterface[];
}
const RubricMainFields: React.FC<RubricMainFieldsInterface> = ({ rubricVariants }) => {
  const { genderOptions } = useConstantOptions();

  return (
    <React.Fragment>
      <FormikCheckboxLine label={'С заглавной буквы в заголовке'} name={'capitalise'} />

      <FormikCheckboxLine
        label={'Показывать название рубрики в заголовке товара'}
        name={'showRubricNameInProductTitle'}
      />

      <FormikCheckboxLine
        label={'Показывать названия категорий в заголовке товара'}
        name={'showCategoryInProductTitle'}
      />

      <FormikCheckboxLine
        label={'Показывать бренды в выпадающем меню каталога'}
        name={'showBrandInNav'}
      />

      <FormikCheckboxLine
        label={'Показывать бренды в фильтре каталога'}
        name={'showBrandInFilter'}
      />

      <FormikCheckboxLine
        label={'Показывать бренд в фильтре в виде алфавита'}
        name={'showBrandAsAlphabet'}
      />

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
        testId={'catalogueTitle-defaultTitleI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Префикс заголовка каталога'}
        name={'prefixI18n'}
        testId={'catalogueTitle-prefixI18n'}
      />

      <FormikTranslationsInput
        label={'Ключевое слово заголовка каталога'}
        name={'keywordI18n'}
        testId={'catalogueTitle-keywordI18n'}
        showInlineError
        isRequired
      />

      <FormikSelect
        firstOption
        name={`gender`}
        label={'Род ключевого слова'}
        testId={'catalogueTitle-gender'}
        showInlineError
        isRequired
        options={genderOptions}
      />

      <FormikSelect
        useIdField
        isRequired
        showInlineError
        label={'Тип рубрики'}
        name={'variantId'}
        testId={'variantId'}
        options={rubricVariants}
      />
    </React.Fragment>
  );
};

export default RubricMainFields;
