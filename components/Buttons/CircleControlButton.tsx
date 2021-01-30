import * as React from 'react';
import classes from './CircleControlButton.module.css';
import ControlButton, { ControlButtonInterface } from './ControlButton';

export interface CircleControlButtonInterface extends ControlButtonInterface {
  withBorder?: boolean;
}

const CircleControlButton: React.FC<CircleControlButtonInterface> = ({
  className,
  withBorder,
  ...props
}) => {
  return (
    <ControlButton
      className={`${classes.butn} ${withBorder ? classes.bordered : ''} ${
        className ? className : ''
      }`}
      {...props}
    />
  );
};

export default CircleControlButton;
