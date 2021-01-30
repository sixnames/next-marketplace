import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import Radio, { RadioInterface } from './Radio';

interface FormikRadioInterface extends Omit<RadioInterface, 'onChange'> {
  name: string;
  className?: string;
}

const FormikRadio: React.FC<FormikRadioInterface> = ({ name, value, ...props }) => {
  return (
    <Field name={name}>
      {({ field, form: { errors, values, setFieldValue } }: FieldProps) => {
        const notValid = !!get(errors, name);
        const isChecked = `${get(values, name)}`.toString() === value;
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
            name={name}
            value={value}
            onChange={onChangeHandler}
            checked={isChecked}
            notValid={notValid}
          />
        );
      }}
    </Field>
  );
};

export default FormikRadio;
