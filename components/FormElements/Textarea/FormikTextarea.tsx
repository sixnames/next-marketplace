import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import Textarea, { TextareaInterface } from './Textarea';

interface FormikTextareaInterface extends TextareaInterface {
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
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, form: { errors } }: FieldProps) => {
        const error = get(errors, name);
        const notValid = Boolean(error);

        return (
          <div className={frameClass ? frameClass : ''}>
            <Textarea
              autoComplete={autoComplete}
              isRequired={isRequired}
              notValid={notValid}
              error={error}
              showInlineError={showInlineError}
              {...field}
              {...props}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FormikTextarea;
