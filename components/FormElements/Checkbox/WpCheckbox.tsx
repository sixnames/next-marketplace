import * as React from 'react';
import { FormikHandlers } from 'formik/dist/types';
import WpIcon from '../../WpIcon';

export interface WpCheckboxInterface {
  name: string;
  onChange: FormikHandlers['handleChange'];
  notValid?: boolean;
  className?: string;
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  testId?: string;
}

const WpCheckbox: React.FC<WpCheckboxInterface> = ({
  notValid,
  className,
  value,
  checked,
  testId,
  disabled,
  ...props
}) => {
  const additionalClassName = className ? className : '';
  const errorClassName = notValid ? 'border-red-500' : 'border-border-300';
  const disabledClassName = disabled
    ? 'opacity-60 pointer-events-none secondary-text'
    : 'text-theme';
  const checkboxClassName = `flex flex-shrink-0 items-center relative w-[18px] h-[18px] border border-border-400 rounded border-1 bg-secondary overflow-hidden cursor-pointer ${additionalClassName} ${errorClassName} ${disabledClassName}`;

  return (
    <label className={checkboxClassName}>
      <input
        {...props}
        type='checkbox'
        className='absolute inset-0 z-20 m-0 h-full w-full cursor-pointer border-none bg-none p-0 opacity-0'
        value={value ? value : ''}
        checked={checked}
        disabled={disabled}
        data-cy={`${testId}-checkbox`}
      />
      {checked ? (
        <WpIcon className='absolute top-[1px] left-[1px] z-10 h-[14px] w-[14px]' name={'check'} />
      ) : null}
    </label>
  );
};

export default WpCheckbox;
