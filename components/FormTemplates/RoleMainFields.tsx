import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikTextarea from 'components/FormElements/Textarea/FormikTextarea';
import * as React from 'react';

const RoleMainFields: React.FC = () => {
  return (
    <React.Fragment>
      <FormikTranslationsInput
        label={'Введите название'}
        name={'nameI18n'}
        testId={'nameI18n'}
        showInlineError
        isRequired
      />

      <FormikTextarea
        testId={'description'}
        name={'description'}
        label={'Описание'}
        isRequired
        showInlineError
      />

      <FormikCheckboxLine testId={'isStaff'} label={'Является персоналом'} name={'isStaff'} />
    </React.Fragment>
  );
};

export default RoleMainFields;
