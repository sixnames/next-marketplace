import React from 'react';
import classes from './MenuButtonSorter.module.css';
import MenuButtonWithName, { MenuButtonWithNameInterface } from './MenuButtonWithName';

interface MenuButtonSorterInterface extends MenuButtonWithNameInterface {
  className?: string;
}

const MenuButtonSorter: React.FC<MenuButtonSorterInterface> = ({
  config,
  initialValue,
  className,
}) => {
  return (
    <div className={`${classes.sort} ${className ? className : ''}`}>
      <div className={classes.sortLabel}>Сортировать</div>
      <MenuButtonWithName config={config} initialValue={initialValue} />
    </div>
  );
};

export default MenuButtonSorter;
