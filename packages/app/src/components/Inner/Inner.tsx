import React, { Fragment } from 'react';
import classes from './Inner.module.css';

interface InnerInterface {
  lowTop?: boolean;
  lowBottom?: boolean;
  wide?: boolean;
  children: any;
  className?: string;
}

const Inner: React.FC<InnerInterface> = ({ lowTop, lowBottom, wide, children, className }) => {
  return (
    <Fragment>
      <div
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
