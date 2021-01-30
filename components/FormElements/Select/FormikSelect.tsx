import * as React from 'react';
import { Field, FieldProps } from 'formik';
import Select, { SelectInterface } from './Select';
import { get } from 'lodash';
import FieldErrorMessage, {
  ErrorMessageGapsInterface,
} from '../FieldErrorMessage/FieldErrorMessage';

export interface FormikSelectInterface extends SelectInterface, ErrorMessageGapsInterface {
  frameClass?: string;
  showInlineError?: boolean;
}

const FormikSelect: React.FC<FormikSelectInterface> = ({
  name,
  options,
  isRequired,
  setNameToValue,
  showInlineError,
  errorMessageLowTop,
  errorMessageLowBottom,
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, form: { errors } }: FieldProps) => {
        const error = get(errors, name);
        const notValid = Boolean(error);
        const showError = showInlineError && notValid;

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

            {showError && (
              <FieldErrorMessage
                errorMessageLowBottom={errorMessageLowBottom}
                errorMessageLowTop={errorMessageLowTop}
                error={error}
                name={name}
              />
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikSelect;
