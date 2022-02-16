import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import WpInput, { WpInputPropsInterface } from './WpInput';

export interface FormikInputPropsInterface extends WpInputPropsInterface {
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
        return (
          <div className={frameClass ? frameClass : ''}>
            <WpInput
              {...field}
              {...props}
              type={type}
              error={error}
              showInlineError={showInlineError}
              isRequired={isRequired}
              autoComplete={autoComplete}
              notValid={notValid}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FormikInput;
