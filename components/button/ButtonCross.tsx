import * as React from 'react';
import ControlButton, { ControlButtonInterface } from 'components/button/ControlButton';

type ButtonCrossInterface = Omit<ControlButtonInterface, 'icon'>;

const ButtonCross: React.FC<ButtonCrossInterface> = ({ ...props }) => {
  return <ControlButton icon={'cross'} {...props} />;
};

export default ButtonCross;
