import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import WpCheckbox, { WpCheckboxInterface } from './WpCheckbox';

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
