import * as React from 'react';
import classes from './StringButton.module.css';
import { ButtonType } from 'types/clientTypes';

interface StringButtonInterface {
  className?: string;
  type?: ButtonType;
  disabled?: boolean;
  onClick?: (e: any) => void;
  testId?: string;
}

const StringButton: React.FC<StringButtonInterface> = ({
  children,
  type = 'button',
  disabled,
  testId,
  onClick,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${classes.butn} ${className ? className : ''}`}
      data-cy={testId}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default StringButton;
