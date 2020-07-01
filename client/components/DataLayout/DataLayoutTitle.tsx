import React from 'react';
import classes from './DataLayout.module.css';

interface DataLayoutTitleInterface {
  className?: string;
  rightClassName?: string;
  titleRight?: any;
  testId?: string;
}

const DataLayoutTitle: React.FC<DataLayoutTitleInterface> = ({
  className,
  children,
  rightClassName,
  titleRight,
  testId,
}) => {
  return (
    <div className={`${classes.Title} ${className ? className : ''}`} data-cy={testId}>
      {children}
      <div
        className={`${classes.TitleRight} ${children ? classes.TitleRightWithGap : ''} ${
          rightClassName ? rightClassName : ''
        }`}
      >
        {titleRight}
      </div>
    </div>
  );
};

export default DataLayoutTitle;
