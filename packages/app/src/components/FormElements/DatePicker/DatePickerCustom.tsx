import React from 'react';
import classes from './DatePickerCustom.module.css';

interface DatePickerCustomInterface {
  notValid?: boolean;
  value?: any;
}

const DatePickerCustom: React.FC<DatePickerCustomInterface> = ({ value, notValid, ...props }) => {
  return (
    <div className={`${classes.frame} ${notValid ? classes.error : ''}`} {...props}>
      {value}
    </div>
  );
};

export default DatePickerCustom;
