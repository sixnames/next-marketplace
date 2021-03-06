import { Field, FieldProps } from 'formik';
import * as React from 'react';
import SpinnerInput, { SpinnerPropsInterface } from './SpinnerInput';

interface FormikSpinnerInputInterface extends Omit<SpinnerPropsInterface, 'value'> {}

const FormikSpinnerInput: React.FC<FormikSpinnerInputInterface> = ({
  name,
  onChange,
  ...props
}) => {
  return (
    <Field name={name} type={'number'}>
      {({ field }: FieldProps) => {
        return (
          <SpinnerInput
            {...field}
            {...props}
            onChange={(e) => {
              if (onChange) {
                onChange(e);
              }
              field.onChange(e);
            }}
          />
        );
      }}
    </Field>
  );
};

export default FormikSpinnerInput;
