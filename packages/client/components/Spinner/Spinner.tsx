import React, { Fragment } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import classes from './Spinner.module.css';

interface SpinnerInterface {
  className?: string;
  isNested?: boolean;
  isTransparent?: boolean;
  wide?: boolean;
}

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
        <CircularProgress />
      </div>
    </Fragment>
  );
};

export default Spinner;
