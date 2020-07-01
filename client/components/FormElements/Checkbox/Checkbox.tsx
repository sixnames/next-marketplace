import React from 'react';
import Icon from '../../Icon/Icon';
import classes from './Checkbox.module.css';
import { FormikHandlers } from 'formik/dist/types';

interface CheckboxInterface {
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
  ...props
}) => {
  const checkedClassName = checked ? classes.checked : '';
  const additionalClassName = className ? className : '';
  const errorClassName = notValid ? classes.error : '';
  const checkboxClassName = `${classes.frame} ${checkedClassName} ${additionalClassName} ${errorClassName}`;

  const iconName = checked ? 'CheckBox' : 'CheckBoxOutlineBlank';

  return (
    <label className={checkboxClassName}>
      <input
        type='checkbox'
        {...props}
        value={value ? value : ''}
        checked={checked}
        data-cy={`${testId}-checkbox`}
      />
      <Icon name={iconName} />
    </label>
  );
};

export default Checkbox;
