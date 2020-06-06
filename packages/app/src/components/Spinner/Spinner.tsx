import React, { Fragment } from 'react';
import AnimateOpacity from '../AnimateOpacity/AnimateOpacity';
import CircularProgress from '@material-ui/core/CircularProgress';
import classes from './Spinner.module.css';

interface SpinnerInterface {
  className?: string;
  isNested?: boolean;
  wide?: boolean;
}

const Spinner: React.FC<SpinnerInterface> = ({ className, isNested, wide = false }) => {
  return (
    <Fragment>
      <AnimateOpacity
        className={`${classes.frame} ${className ? className : ''} ${
          isNested ? classes.nested : ''
        } ${wide ? classes.wide : ''}`}
      >
        <CircularProgress />
      </AnimateOpacity>
    </Fragment>
  );
};

export default Spinner;
