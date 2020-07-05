import React from 'react';
import classes from './DataLayout.module.css';

interface DataLayoutContentFrameInterface {
  className?: string;
  testId?: string;
}

const DataLayoutContentFrame: React.FC<DataLayoutContentFrameInterface> = ({
  children,
  className,
  testId,
}) => {
  return (
    <div className={`${classes.ContentFrame} ${className ? className : ''}`} data-cy={testId}>
      {children}
    </div>
  );
};

export default DataLayoutContentFrame;
