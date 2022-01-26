import * as React from 'react';
import FormikCheckbox, { FormikCheckboxInterface } from './FormikCheckbox';

interface FormikCheckboxLineInterface extends FormikCheckboxInterface {
  label: string;
  low?: boolean;
  lineClassName?: string;
  inList?: boolean;
}

const FormikCheckboxLine: React.FC<FormikCheckboxLineInterface> = ({
  label,
  low,
  lineClassName,
  inList,
  name,
  disabled,
  ...props
}) => {
  return (
    <label
      className={`flex w-full cursor-pointer items-center gap-3 transition-all hover:text-theme ${
        disabled ? 'cursor-default opacity-80' : 'cursor-pointer'
      } ${inList ? 'mb-4' : 'mb-8 h-[var(--formInputHeight)]'} ${low ? 'mb-0' : ''} ${
        lineClassName ? lineClassName : ''
      }`}
    >
      <FormikCheckbox name={name} disabled={disabled} {...props} />
      <span className='block'>{label}</span>
    </label>
  );
};

export default FormikCheckboxLine;
