import * as React from 'react';
import classes from './MenuButtonWithName.module.css';
import ReachMenuButton, { MenuButtonInterface } from './ReachMenuButton';
import Icon from '../Icon/Icon';

export interface MenuButtonWithNameInterface extends Omit<MenuButtonInterface, 'buttonText'> {
  iconPosition?: 'left' | 'right';
  frameClassName?: string;
}

const MenuButtonWithName: React.FC<MenuButtonWithNameInterface> = ({
  className,
  iconPosition = 'left',
  config,
  frameClassName,
  initialValue,
}) => {
  return (
    <div
      className={`${classes.frame} ${
        iconPosition === 'left' ? classes.iconPositionLeft : classes.iconPositionRight
      } ${frameClassName ? frameClassName : ''}`}
    >
      <ReachMenuButton
        config={config}
        className={className}
        initialValue={initialValue}
        buttonText={({ internalButtonText, isOpen }) => (
          <React.Fragment>
            {iconPosition === 'left' ? (
              <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
            ) : null}
            {internalButtonText}
            {iconPosition === 'right' ? (
              <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
            ) : null}
          </React.Fragment>
        )}
      />
    </div>
  );
};

export default MenuButtonWithName;
