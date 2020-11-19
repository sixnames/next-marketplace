import React, { Fragment } from 'react';
import classes from './Spinner.module.css';

interface SpinnerInterface {
  className?: string;
  isNested?: boolean;
  isTransparent?: boolean;
  wide?: boolean;
}
//
const Spinner: React.FC<SpinnerInterface> = ({
  className,
  isNested,
  wide = false,
  isTransparent,
}) => {
  return (
    <Fragment>
      <div
        className={`${classes.frame} ${isTransparent ? classes.transparent : ''} ${
          className ? className : ''
        } ${isNested ? classes.nested : ''} ${wide ? classes.wide : ''}`}
      >
        <svg className={classes.circular}>
          <circle
            className={classes.path}
            cx='50'
            cy='50'
            r='20'
            fill='none'
            strokeWidth='3'
            strokeMiterlimit='10'
          />
        </svg>
      </div>
    </Fragment>
  );
};

export default Spinner;
