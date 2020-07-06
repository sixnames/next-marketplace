import React from 'react';
import { Field, FieldProps } from 'formik';
import Select, { SelectOptionInterface } from './Select';
import { get } from 'lodash';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';
import { PostfixType, SizeType } from '../../../types';

interface FormikSelectInterface {
  name: string;
  className?: string;
  lineClass?: string;
  label?: string;
  low?: boolean;
  wide?: boolean;
  isHorizontal?: boolean;
  labelPostfix?: any;
  postfix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  size?: SizeType;
  value?: any;
  firstOption?: string;
  setNameToValue?: boolean;
  options: SelectOptionInterface[];
  testId?: string;
  showInlineError?: boolean;
  disabled?: boolean;
}

const FormikSelect: React.FC<FormikSelectInterface> = ({
  name,
  options,
  isRequired,
  setNameToValue,
  showInlineError,
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const notValid = !!get(form.errors, name);

        return (
          <div>
            <Select
              {...field}
              {...props}
              setNameToValue={setNameToValue}
              options={options}
              isRequired={isRequired}
              notValid={notValid}
            />

            {showInlineError && notValid && <FieldErrorMessage name={name} />}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikSelect;
