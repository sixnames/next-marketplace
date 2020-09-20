import React from 'react';
import { Field, FieldProps } from 'formik';
import Select, { SelectInterface } from './Select';
import { get } from 'lodash';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';

export interface FormikSelectInterface extends SelectInterface {
  frameClass?: string;
  showInlineError?: boolean;
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
