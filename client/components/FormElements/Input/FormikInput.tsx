import React from 'react';
import Input from './Input';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';
import { InputType, OnOffType, PostfixType, SizeType } from '../../../types';

interface FormikInputPropsInterface {
  name: string;
  className?: string;
  lineClass?: string;
  frameClass?: string;
  label?: string;
  low?: boolean;
  wide?: boolean;
  isHorizontal?: boolean;
  labelPostfix?: any;
  postfix?: PostfixType;
  prefix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  size?: SizeType;
  value?: any;
  type?: InputType;
  autoComplete?: OnOffType;
  placeholder?: string;
  testId?: string;
  showInlineError?: boolean;
  min?: number;
}

const FormikInput: React.FC<FormikInputPropsInterface> = ({
  name,
  autoComplete = 'on',
  isRequired,
  type,
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
            <Input
              {...field}
              {...props}
              type={type}
              isRequired={isRequired}
              autoComplete={autoComplete}
              notValid={notValid}
            />

            {showError && <FieldErrorMessage name={name} />}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikInput;
