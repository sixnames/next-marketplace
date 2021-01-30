import * as React from 'react';
import classes from './Inner.module.css';

export interface InnerInterface {
  lowTop?: boolean;
  lowBottom?: boolean;
  wide?: boolean;
  className?: string;
  testId?: string;
}

const Inner: React.FC<InnerInterface> = ({
  lowTop,
  lowBottom,
  wide,
  children,
  className,
  testId,
}) => {
  return (
    <React.Fragment>
      <div
        data-cy={testId}
        className={`${classes.frame} ${wide ? classes.wide : ''} ${lowTop ? classes.lowTop : ''} ${
          lowBottom ? classes.lowBottom : ''
        } ${className ? className : ''}`}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

export default Inner;
