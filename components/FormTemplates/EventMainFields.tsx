import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
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

      <FormikInput
        name={'seatsCount'}
        testId={'seatsCount'}
        label={'Кол-во посадочных мест'}
        type={'number'}
      />

      <FormikInput name={'price'} testId={'price'} label={'Цена билета'} type={'number'} />

      <FormikDatePicker
        name={'startAt'}
        testId={'startAt'}
        label={'Начало мероприятия'}
        showTimeSelect
      />

      <FormikDatePicker
        name={'endAt'}
        testId={'endAt'}
        label={'Окончание мероприятия'}
        showTimeSelect
      />
    </React.Fragment>
  );
};

export default EventMainFields;
