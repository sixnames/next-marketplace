import * as React from 'react';
import FormikCodeInput from '../FormElements/Input/FormikCodeInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';

const PromoCodeMainFields: React.FC = () => {
  return (
    <React.Fragment>
      <FormikCodeInput testId={'code-input'} name={'code'} isRequired showInlineError />

      <FormikTranslationsInput
        label={'Описание'}
        testId={'descriptionI18n'}
        name={'descriptionI18n'}
      />
    </React.Fragment>
  );
};

export default PromoCodeMainFields;
