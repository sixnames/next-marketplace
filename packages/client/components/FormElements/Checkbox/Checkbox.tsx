import React from 'react';
import Icon from '../../Icon/Icon';
import classes from './Checkbox.module.css';
import { FormikHandlers } from 'formik/dist/types';

export interface CheckboxInterface {
  name: string;
  onChange: FormikHandlers['handleChange'];
  notValid?: boolean;
  className?: string;
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  testId?: string;
}

const Checkbox: React.FC<CheckboxInterface> = ({
  notValid,
  className,
  value,
  checked,
  testId,
  disabled,
  ...props
}) => {
  const checkedClassName = checked ? classes.checked : '';
  const additionalClassName = className ? className : '';
  const errorClassName = notValid ? classes.error : '';
  const disabledClassName = disabled ? classes.disabled : '';
  const checkboxClassName = `${classes.frame} ${checkedClassName} ${additionalClassName} ${errorClassName} ${disabledClassName}`;

  return (
    <label className={checkboxClassName}>
      <input
        type='checkbox'
        {...props}
        value={value ? value : ''}
        checked={checked}
        disabled={disabled}
        data-cy={`${testId}-checkbox`}
      />
      <Icon name={'check'} />
    </label>
  );
};

export default Checkbox;
