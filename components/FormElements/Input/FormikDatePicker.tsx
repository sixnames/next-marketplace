import DatePickerInput, { DatePickerInputInterface } from 'components/FormElements/DatePickerInput';
import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';

export interface FormikDatePickerInterface
  extends Omit<DatePickerInputInterface, 'onChange' | 'error' | 'notValid'> {
  frameClass?: string;
  showInlineError?: boolean;
}

const FormikDatePicker: React.FC<FormikDatePickerInterface> = ({
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
