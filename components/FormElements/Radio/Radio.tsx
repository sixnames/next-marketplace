import * as React from 'react';
import classes from './Radio.module.css';

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
  return (
    <label
      data-cy={testId}
      className={`${classes.frame} ${className ? className : ''} ${notValid ? classes.error : ''}`}
    >
      <input type={'radio'} {...props} />
      <span />
    </label>
  );
};

export default Radio;
