import React from 'react';
import classes from './RowWithGap.module.css';

interface RowWithGapInterface {
  low?: boolean;
  className?: string;
}

const RowWithGap: React.FC<RowWithGapInterface> = ({ low, className, children }) => {
  return (
    <div
      className={`${classes.frame} ${low ? classes.frameLow : ''} ${className ? className : ''}`}
    >
      {children}
    </div>
  );
};

export default RowWithGap;
