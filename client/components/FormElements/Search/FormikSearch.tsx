import React from 'react';
import Icon from '../../Icon/Icon';
import FormikInput from '../Input/FormikInput';
import classes from './FormikSearch.module.css';
import Button from '../../Buttons/Button';

interface FormikSearchInterface {
  resetForm?: (() => void) | null;
  testId?: string;
}

const FormikSearch: React.FC<FormikSearchInterface> = ({ resetForm, testId }) => {
  return (
    <div className={classes.frame}>
      <div className={classes.holder}>
        <FormikInput
          frameClass={classes.line}
          className={classes.input}
          placeholder={`Поиск...`}
          name={'search'}
          low
          testId={`${testId}-search-input`}
        />

        <Button
          circle
          type={'submit'}
          theme={'secondary'}
          className={classes.butn}
          testId={`${testId}-search-submit`}
        >
          <Icon name={`Search`} />
        </Button>
      </div>

      {resetForm && (
        <Button
          circle
          type={'reset'}
          theme={'secondary'}
          className={classes.reset}
          onClick={resetForm}
          testId={`${testId}-search-reset`}
        >
          <Icon name={'Replay'} />
        </Button>
      )}
    </div>
  );
};

export default FormikSearch;
