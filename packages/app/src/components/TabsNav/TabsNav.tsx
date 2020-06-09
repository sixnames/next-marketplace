import React from 'react';
import classes from './TabsNav.module.css';
import { NavLink } from 'react-router-dom';

export interface TabsNavConfigInterface {
  name: string;
  to: string;
}

interface TabsNavInterface {
  navConfig: TabsNavConfigInterface[];
  className?: string;
}

const TabsNav: React.FC<TabsNavInterface> = ({ navConfig, className }) => {
  return (
    <ul className={`${classes.frame} ${className ? className : ''}`}>
      {navConfig.map(({ name, to }) => (
        <li className={`${classes.item}`} key={to}>
          <NavLink activeClassName={classes.active} className={`${classes.link}`} to={to}>
            {name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default TabsNav;
