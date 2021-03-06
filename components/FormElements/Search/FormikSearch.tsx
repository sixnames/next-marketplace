import * as React from 'react';
import ControlButton from '../../button/ControlButton';
import FormikInput from '../Input/FormikInput';

interface FormikSearchInterface {
  resetForm?: (() => void) | null;
  testId?: string;
}

const FormikSearch: React.FC<FormikSearchInterface> = ({ resetForm, testId }) => {
  return (
    <div className='relative mb-6 flex gap-4'>
      <div className='flex-grow'>
        <FormikInput
          frameClass=''
          className=''
          placeholder={`Поиск...`}
          name={'search'}
          size={'small'}
          low
          testId={`${testId}-search-input`}
        />
      </div>

      <div className='relative flex gap-4'>
        <ControlButton
          size={'small'}
          type={'submit'}
          className=''
          testId={`${testId}-search-submit`}
          icon={'search'}
          theme={'accent'}
          roundedFull
        />

        {resetForm ? (
          <ControlButton
            type={'reset'}
            theme={'accent'}
            size={'small'}
            onClick={resetForm}
            testId={`${testId}-search-reset`}
            icon={'arrow-clockwise'}
            roundedFull
          />
        ) : null}
      </div>
    </div>
  );
};

export default FormikSearch;
