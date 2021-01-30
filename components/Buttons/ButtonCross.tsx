import * as React from 'react';
import ControlButton, { ControlButtonInterface } from './ControlButton';

type ButtonCrossInterface = Omit<ControlButtonInterface, 'icon'>;

const ButtonCross: React.FC<ButtonCrossInterface> = ({ ...props }) => {
  return <ControlButton icon={'cross'} {...props} />;
};

export default ButtonCross;
