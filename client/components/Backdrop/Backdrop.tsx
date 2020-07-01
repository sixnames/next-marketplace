import React from 'react';
import classes from './Backdrop.module.css';

interface BackdropInterface {
  className?: string;
  onClick: () => void;
  testId?: string;
}

const Backdrop: React.FC<BackdropInterface> = ({ className, onClick, testId }) => {
  return (
    <div
      className={`${classes.frame} ${className ? className : ''}`}
      onClick={onClick}
      data-cy={testId}
    />
  );
};

export default Backdrop;
