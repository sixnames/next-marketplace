import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikMultiLineInput from 'components/FormElements/Input/FormikMultiLineInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import Notification from 'components/Notification';
import { useConfigContext } from 'context/configContext';
import * as React from 'react';

const ShopMainFields: React.FC = () => {
  const { cities } = useConfigContext();

  const citiesOptions = cities.map((city) => {
    return {
      ...city,
      _id: `${city._id}`,
    };
  });

  return (
    <React.Fragment>
      <FormikSelect
        options={citiesOptions}
        label={'Город'}
        name={'citySlug'}
        testId={'citySlug'}
        firstOption
        showInlineError
        isRequired
      />

      <FormikInput label={'Название'} name={'name'} testId={'name'} showInlineError isRequired />

      <FormikMultiLineInput
        label={'Email'}
        name={'contacts.emails'}
        type={'email'}
        testId={'email'}
        isRequired
        showInlineError
      />

      <FormikMultiLineInput
        label={'Телефон'}
        name={'contacts.phones'}
        type={'tel'}
        testId={'phone'}
        isRequired
        showInlineError
      />

      <FormikInput label={'Лицензия'} name={'license'} testId={'license'} />

      <FormikAddressInput
        label={'Адрес'}
        name={'address'}
        testId={'address'}
        showInlineError
        isRequired
      />

      <div className='mb-8 flex max-w-[980px]'>
        <Notification
          variant={'success'}
          message={`Попробуйте дописать название города в поисковик адреса,если нет нужного результата.`}
        />
      </div>

      <FormikTranslationsInput
        name={'priceWarningI18n'}
        label={
          'Текст предупреждения в корзине о несоответсвии цены на сайте и в физическом магазине'
        }
      />
    </React.Fragment>
  );
};

export default ShopMainFields;
