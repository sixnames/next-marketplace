import React, { Fragment } from 'react';
import classes from './Inner.module.css';

interface InnerInterface {
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
    <Fragment>
      <div
        data-cy={testId}
        className={`${classes.frame} ${wide ? classes.wide : ''} ${lowTop ? classes.lowTop : ''} ${
          lowBottom ? classes.lowBottom : ''
        } ${className ? className : ''}`}
      >
        {children}
      </div>
    </Fragment>
  );
};

export default Inner;
