import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikMultiLineInput from 'components/FormElements/Input/FormikMultiLineInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
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
        firstOption={'Не назначен'}
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

      <FormikAddressInput
        label={'Адрес'}
        name={'address'}
        testId={'address'}
        showInlineError
        isRequired
      />
    </React.Fragment>
  );
};

export default ShopMainFields;
