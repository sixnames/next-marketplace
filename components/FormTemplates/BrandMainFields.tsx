import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikMultiLineInput from 'components/FormElements/Input/FormikMultiLineInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import * as React from 'react';

const BrandMainFields: React.FC = () => {
  return (
    <React.Fragment>
      <FormikTranslationsInput
        label={'Название'}
        name={'nameI18n'}
        testId={'nameI18n'}
        isRequired
        showInlineError
      />

      <FormikTranslationsInput
        label={'Описание'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        showInlineError
      />

      <FormikMultiLineInput
        name={'url'}
        testId={'url'}
        label={'Ссылка на сайт бренда'}
        showInlineError
      />

      <FormikCheckboxLine label={'Показывать в крошках карточки'} name={'showAsBreadcrumb'} />

      <FormikCheckboxLine
        label={'Показывать в крошках каталога'}
        name={'showAsCatalogueBreadcrumb'}
      />

      <FormikCheckboxLine label={'Показывать в заголовке каталога'} name={'showInCatalogueTitle'} />

      <FormikCheckboxLine label={'Показывать в заголовке карточки'} name={'showInCardTitle'} />

      <FormikCheckboxLine label={'Показывать в заголовке сниппета'} name={'showInSnippetTitle'} />
    </React.Fragment>
  );
};

export default BrandMainFields;
