import React, { ReactChild } from 'react';
import classes from './ModalTitle.module.css';

interface ModalTitleInterface {
  className?: string;
  right?: ReactChild;
  subtitle?: any;
}

const ModalTitle: React.FC<ModalTitleInterface> = ({ children, className, right, subtitle }) => {
  return (
    <div className={`${classes.frame} ${className ? className : null}`}>
      <h2 className={classes.text}>
        {children}
        {subtitle && <span className={classes.subtitle}>{subtitle}</span>}
      </h2>

      {right && <div className={classes.right}>{right}</div>}
    </div>
  );
};

export default ModalTitle;
