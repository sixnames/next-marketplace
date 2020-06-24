import React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import Radio from './Radio';

interface FormikRadioInterface {
  name: string;
  className?: string;
  value: string;
}

const FormikRadio: React.FC<FormikRadioInterface> = ({ name, className, value, ...props }) => {
  return (
    <Field name={name}>
      {({ field, form: { errors, values, setFieldValue } }: FieldProps) => {
        const notValid = !!get(errors, name);
        const isChecked = get(values, name).toString() === value;
        const { onChange } = field;

        function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
          if (e.target.value === 'true') {
            setFieldValue(name, true);
          } else if (e.target.value === 'false') {
            setFieldValue(name, false);
          } else {
            onChange(e);
          }
        }

        return (
          <Radio
            {...field}
            {...props}
            value={value}
            onChange={onChangeHandler}
            checked={isChecked}
            className={className}
            notValid={notValid}
          />
        );
      }}
    </Field>
  );
};

export default FormikRadio;
