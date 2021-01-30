import * as React from 'react';
import FormikCheckbox, { FormikCheckboxInterface } from './FormikCheckbox';
import classes from './FormikCheckboxLine.module.css';

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
      className={`${classes.frame} ${disabled ? classes.disabled : ''} ${
        inList ? classes.inList : ''
      } ${low ? classes.low : ''} ${lineClassName ? lineClassName : ''}`}
    >
      <FormikCheckbox name={name} disabled={disabled} {...props} />
      <span className={classes.label}>{label}</span>
    </label>
  );
};

export default FormikCheckboxLine;
