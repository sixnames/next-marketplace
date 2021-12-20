import * as React from 'react';
import WpButton from '../../button/WpButton';
import InputLine from './InputLine';
import WpInput, { WpInputPropsInterface } from './WpInput';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import uniqid from 'uniqid';

export interface FormikCodeInputPropsInterface
  extends Omit<WpInputPropsInterface, 'label' | 'value' | 'type'> {
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
              <WpInput
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

            <WpButton
              frameClassName='w-auto'
              theme={'secondary'}
              onClick={() => {
                setFieldValue(name, uniqid.time());
              }}
            >
              Сгенерировать
            </WpButton>
          </InputLine>
        );
      }}
    </Field>
  );
};

export default FormikCodeInput;
