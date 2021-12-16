import Button from 'components/button/Button';
import InputLine from 'components/FormElements/Input/InputLine';
import * as React from 'react';
import Input, { InputPropsInterface } from './Input';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import uniqid from 'uniqid';

export interface FormikCodeInputPropsInterface
  extends Omit<InputPropsInterface, 'label' | 'value' | 'type'> {
  showInlineError?: boolean;
}

const FormikCodeInput: React.FC<FormikCodeInputPropsInterface> = ({
  name,
  autoComplete = 'on',
  isRequired,
  showInlineError,
  low,
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, form: { errors, setFieldValue } }: FieldProps) => {
        const error = get(errors, name);
        const notValid = Boolean(error);
        return (
          <InputLine low={low} lineContentClass='flex gap-4 items-end'>
            <div className='flex-grow'>
              <Input
                {...field}
                {...props}
                low
                type={'text'}
                label={'Код'}
                error={error}
                showInlineError={showInlineError}
                isRequired={isRequired}
                autoComplete={autoComplete}
                notValid={notValid}
              />
            </div>

            <Button
              frameClassName='w-auto'
              theme={'secondary'}
              onClick={() => {
                setFieldValue(name, uniqid.time());
              }}
            >
              Сгенерировать
            </Button>
          </InputLine>
        );
      }}
    </Field>
  );
};

export default FormikCodeInput;
