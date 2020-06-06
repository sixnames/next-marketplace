import React from 'react';
import { ButtonType, TooltipPlacement } from '../../types';
import Button from './Button';

interface ButtonPropsInterface {
  className?: string;
  iconClass?: string;
  type?: ButtonType;
  disabled?: boolean;
  title?: string;
  tooltipPlacement?: TooltipPlacement;
  onClick?: () => void;
  testId?: string;
}

const ButtonCross: React.FC<ButtonPropsInterface> = ({ ...props }) => {
  return <Button size={'small'} theme={'gray'} circle icon={'Close'} {...props} />;
};

export default ButtonCross;
