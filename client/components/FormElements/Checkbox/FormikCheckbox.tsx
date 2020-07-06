import React from 'react';
import { Field, FieldProps } from 'formik';
import Checkbox from './Checkbox';
import { get } from 'lodash';

interface FormikCheckboxInterface {
  name: string;
  disabled?: boolean;
  testId?: string;
  className?: string;
}

const FormikCheckbox: React.FC<FormikCheckboxInterface> = ({ name, disabled, ...props }) => {
  return (
    <Field name={name} type={'checkbox'}>
      {({ field, form }: FieldProps) => {
        const innerNotValid = !!get(form.errors, name);
        return <Checkbox {...field} {...props} disabled={disabled} notValid={innerNotValid} />;
      }}
    </Field>
  );
};

export default FormikCheckbox;
