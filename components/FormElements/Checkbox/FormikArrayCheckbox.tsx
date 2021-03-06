import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import WpCheckbox from './WpCheckbox';

interface FormikArrayCheckboxInterface {
  name: string;
  disabled?: boolean;
  testId?: string;
  className?: string;
  value: string | number;
}

const FormikArrayCheckbox: React.FC<FormikArrayCheckboxInterface> = ({
  name,
  disabled,
  value,
  testId,
  className,
  ...props
}) => {
  return (
    <Field name={name}>
      {({ form }: FieldProps) => {
        const innerNotValid = !!get(form.errors, name);
        const fieldValue: any[] = get(form.values, name) || [];
        const checked = fieldValue.includes(value);

        function onChange() {
          if (checked) {
            form.setFieldValue(
              name,
              fieldValue.filter((current) => current !== value),
            );
          } else {
            form.setFieldValue(name, [...fieldValue, value]);
          }
        }

        return (
          <WpCheckbox
            {...props}
            testId={testId}
            name={name}
            onChange={onChange}
            checked={checked}
            disabled={disabled}
            className={`${className ? className : ''}`}
            notValid={innerNotValid}
          />
        );
      }}
    </Field>
  );
};

export default FormikArrayCheckbox;
