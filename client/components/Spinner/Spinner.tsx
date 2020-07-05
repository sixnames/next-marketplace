import React, { Fragment } from 'react';
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
      <div
        className={`${classes.frame} ${className ? className : ''} ${
          isNested ? classes.nested : ''
        } ${wide ? classes.wide : ''}`}
      >
        <CircularProgress />
      </div>
    </Fragment>
  );
};

export default Spinner;
