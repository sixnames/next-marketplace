import React from 'react';
import { Field, FieldProps } from 'formik';
import Textarea from './Textarea';
import { get } from 'lodash';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';
import { OnOffType, PostfixType, SizeType } from '../../../types';

interface FormikTextareaInterface {
  name: string;
  className?: string;
  lineClass?: string;
  frameClass?: string;
  label: string;
  low?: boolean;
  wide?: boolean;
  labelPostfix?: any;
  postfix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  size?: SizeType;
  value?: any;
  autoComplete?: OnOffType;
  showInlineError?: boolean;
  testId?: string;
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
            {showError && <FieldErrorMessage name={name} />}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikTextarea;
