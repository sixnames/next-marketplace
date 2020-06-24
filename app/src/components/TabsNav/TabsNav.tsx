import React from 'react';
import classes from './TabsNav.module.css';
import { NavLink } from 'react-router-dom';
import { NavItemInterface } from '../../types';

interface TabsNavInterface {
  navConfig: NavItemInterface[];
  className?: string;
}

const TabsNav: React.FC<TabsNavInterface> = ({ navConfig, className }) => {
  return (
    <ul className={`${classes.frame} ${className ? className : ''}`}>
      {navConfig.map(({ name, to, testId }) => (
        <li className={`${classes.item}`} key={name} data-cy={`tabs-nav-item-${testId}`}>
          <NavLink activeClassName={classes.active} className={`${classes.link}`} to={to}>
            {name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default TabsNav;
