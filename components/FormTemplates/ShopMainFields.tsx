import * as React from 'react';
import { useConfigContext } from '../../context/configContext';
import FormikAddressInput from '../FormElements/Input/FormikAddressInput';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikMultiLineInput from '../FormElements/Input/FormikMultiLineInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import WpNotification from '../WpNotification';

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
        <WpNotification
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
