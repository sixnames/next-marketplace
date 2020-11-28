import React, { ReactChild } from 'react';
import classes from './ModalTitle.module.css';
import { SizeType } from '../../types';

interface ModalTitleInterface {
  className?: string;
  right?: ReactChild;
  subtitle?: any;
  size?: SizeType;
}

const ModalTitle: React.FC<ModalTitleInterface> = ({
  children,
  size = 'normal',
  className,
  right,
  subtitle,
}) => {
  return (
    <div className={`${classes.frame} ${className ? className : null}`}>
      <h2 className={`${classes.text} ${size === 'small' ? classes.textSmall : ''}`}>
        {children}
        {subtitle && <span className={classes.subtitle}>{subtitle}</span>}
      </h2>

      {right && <div className={classes.right}>{right}</div>}
    </div>
  );
};

export default ModalTitle;
