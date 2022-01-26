import * as React from 'react';
import FormikRadio from './FormikRadio';

interface FormikRadioLineInterface {
  name: string;
  className?: string;
  value: string;
  label: string;
}

const FormikRadioLine: React.FC<FormikRadioLineInterface> = ({
  name,
  className,
  label,
  ...props
}) => {
  return (
    <label
      className={`mr-4 flex min-h-[var(--formInputHeight)] cursor-pointer items-center ${
        className ? className : ''
      }`}
    >
      <FormikRadio name={name} {...props} />
      <span className='flex-grow pl-2 text-secondary-text'>{label}</span>
    </label>
  );
};

export default FormikRadioLine;
