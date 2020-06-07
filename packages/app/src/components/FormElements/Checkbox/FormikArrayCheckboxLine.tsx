import React from 'react';
import FormikArrayCheckbox from './FormikArrayCheckbox';
import classes from './FormikCheckboxLine.module.css';

interface FormikArrayCheckboxLineInterface {
  label: string;
  low?: boolean;
  className?: string;
  inList?: boolean;
  name: string;
  disabled?: boolean;
  value: string | number;
  testId?: string;
}

const FormikArrayCheckboxLine: React.FC<FormikArrayCheckboxLineInterface> = ({
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
      <FormikArrayCheckbox name={name} disabled={disabled} {...props} />
      <span className={classes.label}>{label}</span>
    </label>
  );
};

export default FormikArrayCheckboxLine;
