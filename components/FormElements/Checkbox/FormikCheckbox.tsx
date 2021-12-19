import * as React from 'react';
import { Field, FieldProps } from 'formik';
import WpCheckbox, { WpCheckboxInterface } from './WpCheckbox';
import { get } from 'lodash';

export type FormikCheckboxInterface = Omit<WpCheckboxInterface, 'onChange'>;

const FormikCheckbox: React.FC<FormikCheckboxInterface> = ({ name, disabled, ...props }) => {
  return (
    <Field name={name} type={'checkbox'}>
      {({ field, form }: FieldProps) => {
        const innerNotValid = !!get(form.errors, name);
        return <WpCheckbox {...field} {...props} disabled={disabled} notValid={innerNotValid} />;
      }}
    </Field>
  );
};

export default FormikCheckbox;
