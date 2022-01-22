import * as React from 'react';
import FormikCodeInput from '../FormElements/Input/FormikCodeInput';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';

const GiftCertificateMainFields: React.FC = () => {
  return (
    <React.Fragment>
      <FormikCodeInput name={'code'} isRequired showInlineError />

      <FormikInput
        label={'Сумма'}
        type={'number'}
        testId={'initialValue'}
        name={'initialValue'}
        isRequired
        showInlineError
      />

      <FormikTranslationsInput label={'Название'} testId={'nameI18n'} name={'nameI18n'} />

      <FormikTranslationsInput
        label={'Описание'}
        testId={'descriptionI18n'}
        name={'descriptionI18n'}
      />
    </React.Fragment>
  );
};

export default GiftCertificateMainFields;
