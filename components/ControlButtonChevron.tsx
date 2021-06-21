import * as React from 'react';
import CircleControlButton, { CircleControlButtonInterface } from 'components/CircleControlButton';

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
      className={`${className ? className : ''}`}
      iconClass={`${isActive ? 'fill-theme' : ''} ${iconClass ? iconClass : ''}`}
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
