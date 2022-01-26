import * as React from 'react';
import { FormikErrors } from 'formik';

interface FieldErrorMessageInterface {
  name: string;
  className?: string;
  error: string | FormikErrors<any> | string[] | FormikErrors<any>[] | undefined;
}

const FieldErrorMessage: React.FC<FieldErrorMessageInterface> = ({ name, error, className }) => {
  if (!error) {
    return null;
  }

  return (
    <div
      className={`mt-4 font-medium text-red-500 ${className ? className : ''}`}
      data-cy={`${name}-error`}
    >
      {`${error}`}
    </div>
  );
};

export default FieldErrorMessage;
