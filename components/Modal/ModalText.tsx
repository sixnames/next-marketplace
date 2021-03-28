import * as React from 'react';
import classes from './ModalText.module.css';

interface ModalTextInterface {
  className?: string;
  centered?: boolean;
  warning?: boolean;
  lowTop?: boolean;
  lowBottom?: boolean;
}

const ModalText: React.FC<ModalTextInterface> = ({
  children,
  lowBottom,
  lowTop,
  className,
  centered,
  warning,
}) => {
  return (
    <div
      style={{ textAlign: centered ? 'center' : 'left' }}
      className={`${classes.text} ${lowBottom ? classes.textLowBottom : ''} ${
        lowTop ? classes.textLowTop : ''
      } ${className ? className : ''} ${warning ? classes.warning : ''}`}
    >
      {children}
    </div>
  );
};

export default ModalText;
