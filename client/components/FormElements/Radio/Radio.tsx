import React from 'react';
import classes from './Radio.module.css';

interface RadioInterface {
  notValid?: boolean;
  className?: string;
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Radio: React.FC<RadioInterface> = ({ notValid, className, checked, ...props }) => {
  return (
    <label
      className={`${classes.frame} ${className ? className : ''} ${notValid ? classes.error : ''}`}
    >
      <input type={'radio'} {...props} />
      <span />
    </label>
  );
};

export default Radio;
