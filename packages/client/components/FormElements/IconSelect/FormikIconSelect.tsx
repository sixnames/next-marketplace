import React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';
import IconSelect, { IconSelectInterface } from './IconSelect';

export interface FormikSelectInterface extends IconSelectInterface {
  frameClass?: string;
  showInlineError?: boolean;
}

const FormikIconSelect: React.FC<FormikSelectInterface> = ({
  name,
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
            <IconSelect
              {...field}
              {...props}
              setNameToValue={setNameToValue}
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

export default FormikIconSelect;
