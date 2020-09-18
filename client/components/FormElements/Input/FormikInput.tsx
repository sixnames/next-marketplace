import React from 'react';
import Input, { InputPropsInterface } from './Input';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';

export interface FormikInputPropsInterface extends InputPropsInterface {
  frameClass?: string;
  showInlineError?: boolean;
}

const FormikInput: React.FC<FormikInputPropsInterface> = ({
  name,
  autoComplete = 'on',
  isRequired,
  type,
  showInlineError,
  frameClass,
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, form: { errors } }: FieldProps) => {
        const error = get(errors, name);
        const notValid = Boolean(error);
        const showError = showInlineError && notValid;
        console.log(field.value);
        return (
          <div className={frameClass ? frameClass : ''}>
            <Input
              {...field}
              {...props}
              type={type}
              isRequired={isRequired}
              autoComplete={autoComplete}
              notValid={notValid}
            />

            {showError && <FieldErrorMessage name={name} />}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikInput;
