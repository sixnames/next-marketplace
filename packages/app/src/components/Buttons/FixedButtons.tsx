import React from 'react';
import classes from './FixedButtons.module.css';

interface FixedButtonsInterface {
  children: any;
  visible?: boolean;
  absolute?: boolean;
}

const FixedButtons: React.FC<FixedButtonsInterface> = ({ children, visible = true, absolute }) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      data-cy={'fixed-buttons'}
      className={`${classes.frame} ${absolute ? classes.frameAbsolute : classes.frameFixed}`}
    >
      {children}
    </div>
  );
};

export default FixedButtons;
