import React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import FieldErrorMessage, {
  ErrorMessageGapsInterface,
} from '../FieldErrorMessage/FieldErrorMessage';
import IconSelect, { IconSelectInterface } from './IconSelect';

export interface FormikSelectInterface extends IconSelectInterface, ErrorMessageGapsInterface {
  frameClass?: string;
  showInlineError?: boolean;
}

const FormikIconSelect: React.FC<FormikSelectInterface> = ({
  name,
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
            <IconSelect
              {...field}
              {...props}
              setNameToValue={setNameToValue}
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

export default FormikIconSelect;
