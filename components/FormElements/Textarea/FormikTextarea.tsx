import * as React from 'react';
import { Field, FieldProps } from 'formik';
import Textarea, { TextareaInterface } from './Textarea';
import { get } from 'lodash';
import FieldErrorMessage, {
  ErrorMessageGapsInterface,
} from '../FieldErrorMessage/FieldErrorMessage';

interface FormikTextareaInterface extends TextareaInterface, ErrorMessageGapsInterface {
  name: string;
  frameClass?: string;
  showInlineError?: boolean;
}

const FormikTextarea: React.FC<FormikTextareaInterface> = ({
  name,
  autoComplete = 'on',
  isRequired,
  showInlineError,
  frameClass,
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
          <div className={frameClass ? frameClass : ''}>
            <Textarea
              autoComplete={autoComplete}
              isRequired={isRequired}
              notValid={notValid}
              {...field}
              {...props}
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

export default FormikTextarea;
