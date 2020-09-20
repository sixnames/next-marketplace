import React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';

interface OnChangeInterface {
  target: {
    checked: boolean;
    value: string;
  };
}

interface ChildrenInterface {
  error?: boolean;
  onChange: (arg: OnChangeInterface) => void;
  getIsChecked: (value: string) => void;
}

interface FormikMultipleCheckboxesInterface {
  name: string;
  children: (arg: ChildrenInterface) => void;
}

const FormikMultipleCheckboxes: React.FC<FormikMultipleCheckboxesInterface> = ({
  name,
  children,
}) => {
  return (
    <Field name={name} type={'checkbox'}>
      {({ field, form: { errors, setFieldValue } }: FieldProps) => {
        const error = !!get(errors, name);
        const { value } = field;

        function onChangeHandler({ target }: OnChangeInterface) {
          if (target.checked) {
            setFieldValue(name, [...value, target.value]);
          } else {
            setFieldValue(
              name,
              value.filter((item: string) => item !== target.value),
            );
          }
        }

        function getIsChecked(itemValue: string) {
          return value.includes(itemValue);
        }

        return children({
          error,
          onChange: onChangeHandler,
          getIsChecked,
        });
      }}
    </Field>
  );
};

export default FormikMultipleCheckboxes;
