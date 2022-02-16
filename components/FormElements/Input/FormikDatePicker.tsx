import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import DatePickerInput, { DatePickerInputInterface } from '../DatePickerInput';

export interface FormikDatePickerInterface
  extends Omit<DatePickerInputInterface, 'onChange' | 'error' | 'notValid'> {
  frameClass?: string;
  showInlineError?: boolean;
}

const FormikDatePicker: React.FC<FormikDatePickerInterface> = ({
  name,
  autoComplete = 'off',
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
            <DatePickerInput
              {...field}
              {...props}
              selected={field.value}
              error={error}
              showInlineError={showInlineError}
              isRequired={isRequired}
              autoComplete={autoComplete}
              notValid={notValid}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FormikDatePicker;
