import { useConfigContext } from 'components/context/configContext';
import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import * as React from 'react';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';

const EventMainFields: React.FC = () => {
  const { cities } = useConfigContext();
  const citiesOptions = cities.map((city) => {
    return {
      ...city,
      _id: `${city._id}`,
    };
  });

  return (
    <React.Fragment>
      <FormikTranslationsInput
        isRequired
        label={'Название'}
        name={'nameI18n'}
        testId={'nameI18n'}
      />

      <FormikTranslationsInput
        isRequired
        label={'Мета-тег Description'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        showInlineError
      />

      <FormikSelect
        options={citiesOptions}
        label={'Город'}
        name={'citySlug'}
        testId={'citySlug'}
        firstOption
        showInlineError
        isRequired
      />

      <FormikAddressInput isRequired label={'Адрес'} name={'address'} testId={'address'} />

      <FormikInput
        isRequired
        name={'seatsCount'}
        testId={'seatsCount'}
        label={'Кол-во посадочных мест'}
        type={'number'}
      />

      <FormikInput name={'price'} testId={'price'} label={'Цена билета'} type={'number'} />

      <FormikDatePicker
        isRequired
        name={'startAt'}
        testId={'startAt'}
        label={'Начало мероприятия'}
        showTimeSelect
      />

      <FormikDatePicker
        isRequired
        name={'endAt'}
        testId={'endAt'}
        label={'Окончание мероприятия'}
        showTimeSelect
      />
    </React.Fragment>
  );
};

export default EventMainFields;
