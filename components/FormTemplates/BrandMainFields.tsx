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
    </React.Fragment>
  );
};

export default BrandMainFields;
