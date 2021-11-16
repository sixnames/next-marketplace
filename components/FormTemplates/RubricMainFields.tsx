import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import { RubricVariant, SelectOption } from 'generated/apolloComponents';
import * as React from 'react';

interface RubricMainFieldsInterface {
  rubricVariants: Pick<RubricVariant, '_id' | 'name' | 'nameI18n'>[];
  genderOptions: Pick<SelectOption, '_id' | 'name'>[];
}
const RubricMainFields: React.FC<RubricMainFieldsInterface> = ({
  genderOptions,
  rubricVariants,
}) => {
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
