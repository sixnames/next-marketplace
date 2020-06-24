import React from 'react';
import FormikCheckbox from './FormikCheckbox';
import classes from './FormikCheckboxLine.module.css';

interface FormikCheckboxLineInterface {
  label: string;
  low?: boolean;
  className?: string;
  inList?: boolean;
  name: string;
  disabled?: boolean;
  testId?: string;
}

const FormikCheckboxLine: React.FC<FormikCheckboxLineInterface> = ({
  label,
  low,
  className,
  inList,
  name,
  disabled,
  ...props
}) => {
  return (
    <label
      className={`${classes.frame} ${disabled ? classes.disabled : ''} ${
        inList ? classes.inList : ''
      } ${low ? classes.low : ''} ${className ? className : ''}`}
    >
      <FormikCheckbox name={name} disabled={disabled} {...props} />
      <span className={classes.label}>{label}</span>
    </label>
  );
};

export default FormikCheckboxLine;
