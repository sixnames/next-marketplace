import * as React from 'react';
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
      className={`rounded-full ${withBorder ? 'border border-border-300' : ''} ${
        className ? className : ''
      }`}
      {...props}
    />
  );
};

export default CircleControlButton;
