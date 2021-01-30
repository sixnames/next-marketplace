import * as React from 'react';
import classes from './FieldErrorMessage.module.css';
import { FormikErrors } from 'formik';

export interface ErrorMessageGapsInterface {
  errorMessageLowBottom?: boolean;
  errorMessageLowTop?: boolean;
}

interface FieldErrorMessageInterface extends ErrorMessageGapsInterface {
  name: string;
  className?: string;
  error: string | FormikErrors<any> | string[] | FormikErrors<any>[] | undefined;
}

const FieldErrorMessage: React.FC<FieldErrorMessageInterface> = ({
  name,
  error,
  className,
  errorMessageLowTop,
  errorMessageLowBottom,
}) => {
  if (!error) {
    return null;
  }

  return (
    <div
      className={`${classes.frame} ${errorMessageLowBottom ? classes.frameLowBottom : ''} ${
        errorMessageLowTop ? classes.frameLowTop : ''
      } ${className ? className : ''}`}
      data-cy={`${name}-error`}
    >
      {`${error}`}
    </div>
  );
};

export default FieldErrorMessage;
