import React from 'react';
import classes from './ModalText.module.css';

interface ModalTextInterface {
  className?: string;
  centered?: boolean;
  warning?: boolean;
}

const ModalText: React.FC<ModalTextInterface> = ({ children, className, centered, warning }) => {
  return (
    <div
      style={{ textAlign: centered ? 'center' : 'left' }}
      className={`${classes.frame} ${className ? className : ''} ${warning ? classes.warning : ''}`}
    >
      {children}
    </div>
  );
};

export default ModalText;
