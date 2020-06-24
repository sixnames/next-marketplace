import React from 'react';
import classes from './ModalButtons.module.css';

interface ModalButtonsInterface {
  className?: string;
  withInner?: boolean;
}

const ModalButtons: React.FC<ModalButtonsInterface> = ({ children, className, withInner }) => {
  return (
    <div
      className={`${classes.frame} ${className ? className : null} ${
        withInner ? classes.withInner : ''
      }`}
    >
      {children}
    </div>
  );
};

export default ModalButtons;
