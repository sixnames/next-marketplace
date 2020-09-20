import React from 'react';
import Button, { ButtonPropsInterface } from './Button';

type ButtonCrossInterface = Omit<ButtonPropsInterface, 'size' | 'theme' | 'icon'>;

const ButtonCross: React.FC<ButtonCrossInterface> = ({ ...props }) => {
  return <Button size={'small'} theme={'secondary'} circle icon={'cross'} {...props} />;
};

export default ButtonCross;
