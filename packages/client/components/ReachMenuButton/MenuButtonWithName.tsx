import React, { Fragment } from 'react';
import classes from './MenuButtonWithName.module.css';
import ReachMenuButton, { MenuButtonInterface } from './ReachMenuButton';
import Icon from '../Icon/Icon';

type MenuButtonWithNameInterface = Omit<MenuButtonInterface, 'buttonText'>;

const MenuButtonWithName: React.FC<MenuButtonWithNameInterface> = ({ className, config }) => {
  return (
    <div className={classes.frame}>
      <ReachMenuButton
        config={config}
        className={className}
        buttonText={({ internalButtonText, isOpen }) => (
          <Fragment>
            <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
            {internalButtonText}
          </Fragment>
        )}
      />
    </div>
  );
};

export default MenuButtonWithName;
