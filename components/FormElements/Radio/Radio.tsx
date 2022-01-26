import * as React from 'react';

export interface RadioInterface {
  notValid?: boolean;
  className?: string;
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testId?: string;
}

const Radio: React.FC<RadioInterface> = ({ notValid, className, testId, checked, ...props }) => {
  const inputBorder = notValid ? 'border-red-500' : `input-border`;
  return (
    <label
      data-cy={testId}
      className={`relative h-[16px] w-[16px] cursor-pointer overflow-hidden rounded-full border-2 bg-primary ${inputBorder} ${
        className ? className : ''
      }`}
    >
      <input className='visually-hidden radio-input' type={'radio'} {...props} />
      <span className='absolute top-[1px] left-[1px] block h-[10px] w-[10px] rounded-full bg-primary transition-all duration-200' />
    </label>
  );
};

export default Radio;
