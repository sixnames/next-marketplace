import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import Select, { SelectInterface } from './Select';

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
      {({ field, form: { errors } }: FieldProps) => {
        const error = get(errors, name);
        const notValid = Boolean(error);

        return (
          <div>
            <Select
              {...field}
              {...props}
              setNameToValue={setNameToValue}
              options={options}
              isRequired={isRequired}
              notValid={notValid}
              error={error}
              showInlineError={showInlineError}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FormikSelect;
