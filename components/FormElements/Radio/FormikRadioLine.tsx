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
      className={`cursor-pointer flex items-center mr-4 min-h-[var(--formInputHeight)] ${
        className ? className : ''
      }`}
    >
      <FormikRadio name={name} {...props} />
      <span className='pl-2 flex-grow text-secondary-text'>{label}</span>
    </label>
  );
};

export default FormikRadioLine;
