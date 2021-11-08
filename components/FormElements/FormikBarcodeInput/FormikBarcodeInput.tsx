import Button from 'components/button/Button';
import Input, { InputPropsInterface } from 'components/FormElements/Input/Input';
import InputLine from 'components/FormElements/Input/InputLine';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';

const BarcodeReader = dynamic(() => import('components/BarcodeReader'), {
  ssr: false,
});

export interface FormikBarcodeInputPropsInterface extends InputPropsInterface {
  frameClass?: string;
  showInlineError?: boolean;
}

const FormikBarcodeInput: React.FC<FormikBarcodeInputPropsInterface> = ({
  name,
  autoComplete = 'on',
  isRequired,
  type,
  showInlineError,
  frameClass,
  lineClass,
  label,
  labelTag,
  isHorizontal,
  labelPostfix,
  labelLink,
  low,
  wide,
  lineIcon,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <Field name={name}>
      {({ field, form: { errors, setFieldValue } }: FieldProps) => {
        const error = get(errors, name);
        const notValid = Boolean(error);
        return (
          <div className={frameClass ? frameClass : ''}>
            <InputLine
              isRequired={isRequired}
              name={name}
              lineClass={lineClass}
              label={label}
              labelTag={labelTag}
              isHorizontal={isHorizontal}
              labelPostfix={labelPostfix}
              labelLink={labelLink}
              low={low}
              wide={wide}
              lineIcon={lineIcon}
              showInlineError={showInlineError}
              lineContentClass='flex'
              error={error}
            >
              <div className='flex-grow'>
                <Input
                  low
                  {...field}
                  {...props}
                  type={type}
                  error={error}
                  showInlineError={showInlineError}
                  isRequired={isRequired}
                  autoComplete={autoComplete}
                  notValid={notValid}
                />
              </div>
              <Button
                onClick={() => {
                  setIsVisible((prevState) => !prevState);
                }}
                theme={'secondary'}
                icon={isVisible ? 'camera-off' : 'camera'}
                className='w-[var(--formInputHeight)] ml-6'
                short
              />
            </InputLine>

            {isVisible ? (
              <div className='mb-8 flex justify-center'>
                <BarcodeReader
                  isVisible={isVisible}
                  setValue={(code) => {
                    setFieldValue(name, code);
                    setIsVisible(false);
                  }}
                />
              </div>
            ) : null}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikBarcodeInput;
