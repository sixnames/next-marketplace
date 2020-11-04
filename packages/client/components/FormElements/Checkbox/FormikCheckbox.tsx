import React from 'react';
import { Field, FieldProps } from 'formik';
import Checkbox, { CheckboxInterface } from './Checkbox';
import { get } from 'lodash';

export type FormikCheckboxInterface = Omit<CheckboxInterface, 'onChange'>;

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
