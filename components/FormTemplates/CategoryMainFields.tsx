import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { useGetGenderOptionsQuery } from 'generated/apolloComponents';
import * as React from 'react';

const CategoryMainFields: React.FC = () => {
  const { data, loading, error } = useGetGenderOptionsQuery();
  if (error || (!loading && !data)) {
    return <RequestError />;
  }

  if (loading) {
    return <Spinner isTransparent isNested />;
  }

  const { getGenderOptions } = data!;

  return (
    <React.Fragment>
      <FormikTranslationsInput
        name={'nameI18n'}
        testId={'nameI18n'}
        showInlineError
        label={'Название'}
        isRequired
      />

      <FormikSelect
        name={'gender'}
        firstOption
        options={getGenderOptions}
        testId={`gender`}
        label={'Род названия'}
      />
    </React.Fragment>
  );
};

export default CategoryMainFields;
