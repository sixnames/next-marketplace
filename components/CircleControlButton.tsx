import * as React from 'react';
import ControlButton, { ControlButtonInterface } from 'components/ControlButton';

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
      className={`rounded-full ${withBorder ? 'border border-border-color' : ''} ${
        className ? className : ''
      }`}
      {...props}
    />
  );
};

export default CircleControlButton;
