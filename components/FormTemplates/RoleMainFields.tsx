import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
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

      <FormikTranslationsInput
        label={'Описание'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        type={'text'}
        showInlineError
        isRequired
      />

      <FormikCheckboxLine testId={'isStaff'} label={'Сотрудник сайта'} name={'isStaff'} />

      <FormikCheckboxLine
        testId={'isCompanyStaff'}
        label={'Сотрудник компании'}
        name={'isCompanyStaff'}
      />

      <FormikCheckboxLine
        testId={'showAdminUiInCatalogue'}
        label={'Показывать интерфейс администратора в каталоге'}
        name={'showAdminUiInCatalogue'}
      />
    </React.Fragment>
  );
};

export default RoleMainFields;
