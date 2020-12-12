import React from 'react';
import CircleControlButton, { CircleControlButtonInterface } from './CircleControlButton';
import classes from './ControlButtonChevron.module.css';

interface ControlButtonChevronInterface
  extends Omit<
    CircleControlButtonInterface,
    'withBorder' | 'iconPositionLeft' | 'iconPositionTop' | 'icon' | 'size' | 'iconSize'
  > {
  isActive?: boolean;
}

const ControlButtonChevron: React.FC<ControlButtonChevronInterface> = ({
  className,
  isActive,
  iconClass,
  ...props
}) => {
  return (
    <CircleControlButton
      className={`${className ? className : ''} ${classes.frame}`}
      iconClass={`${isActive ? classes.activeIcon : ''} ${iconClass ? iconClass : ''}`}
      iconPositionTop={isActive ? 0 : 2}
      withBorder
      icon={isActive ? 'chevron-up' : 'chevron-down'}
      size={'small'}
      iconSize={'small'}
      {...props}
    />
  );
};

export default ControlButtonChevron;
