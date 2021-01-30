import * as React from 'react';
import classes from './ModalTitle.module.css';
import { SizeType } from 'types/clientTypes';

interface ModalTitleInterface {
  className?: string;
  right?: React.ReactChild;
  subtitle?: any;
  size?: SizeType;
  low?: boolean;
}

const ModalTitle: React.FC<ModalTitleInterface> = ({
  children,
  size = 'normal',
  className,
  right,
  subtitle,
  low,
}) => {
  return (
    <div
      className={`${classes.frame} ${low ? classes.frameLow : ''} ${className ? className : null}`}
    >
      <h2 className={`${classes.text} ${size === 'small' ? classes.textSmall : ''}`}>
        {children}
        {subtitle && <span className={classes.subtitle}>{subtitle}</span>}
      </h2>

      {right && <div className={classes.right}>{right}</div>}
    </div>
  );
};

export default ModalTitle;
