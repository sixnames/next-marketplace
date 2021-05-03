import * as React from 'react';
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
      className={`relative z-10 flex items-center justify-center text-theme transition duration-150 font-medium disabled:opacity-70 ${
        className ? className : ''
      }`}
      data-cy={testId}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default StringButton;
