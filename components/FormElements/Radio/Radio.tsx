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
      className={`relative w-[16px] h-[16px] bg-primary border-2 rounded-full overflow-hidden cursor-pointer ${inputBorder} ${
        className ? className : ''
      }`}
    >
      <input className='visually-hidden radio-input' type={'radio'} {...props} />
      <span className='absolute top-[1px] left-[1px] w-[10px] h-[10px] bg-primary rounded-full transition-all duration-200 block' />
    </label>
  );
};

export default Radio;
