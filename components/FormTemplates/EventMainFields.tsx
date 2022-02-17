import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import * as React from 'react';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';

const EventMainFields: React.FC = () => {
  return (
    <React.Fragment>
      <FormikTranslationsInput label={'Название'} name={'nameI18n'} testId={'nameI18n'} />

      <FormikTranslationsInput
        label={'Мета-тег Description'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        showInlineError
      />

      <FormikAddressInput label={'Адрес'} name={'address'} testId={'address'} />

      <FormikInput name={'seatsCount'} testId={'seatsCount'} label={'Кол-во посадочных мест'} />

      <FormikInput name={'price'} testId={'price'} label={'Цена билета'} />
    </React.Fragment>
  );
};

export default EventMainFields;
