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
      className={`flex items-center w-full cursor-pointer gap-3 hover:text-theme transition-all ${
        disabled ? 'cursor-default opacity-80' : 'cursor-pointer'
      } ${inList ? 'mb-4' : 'h-[var(--formInputHeight)] mb-8'} ${low ? 'mb-0' : ''} ${
        lineClassName ? lineClassName : ''
      }`}
    >
      <FormikCheckbox name={name} disabled={disabled} {...props} />
      <span className='block'>{label}</span>
    </label>
  );
};

export default FormikCheckboxLine;
