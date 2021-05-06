import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
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
      {({ field, form: { errors } }: FieldProps) => {
        const error = get(errors, name);
        const notValid = Boolean(error);

        return (
          <div>
            <IconSelect
              {...field}
              {...props}
              setNameToValue={setNameToValue}
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

export default FormikIconSelect;
