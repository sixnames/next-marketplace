import React from 'react';
import classes from './TabsNav.module.css';
import { Link } from 'react-router-dom';

export interface TabsNavConfigInterface {
  name: string;
  href: string;
}

interface TabsNavInterface {
  navConfig: TabsNavConfigInterface[];
  className?: string;
}

// TODO [Slava] active class
const TabsNav: React.FC<TabsNavInterface> = ({ navConfig, className }) => {
  return (
    <ul className={`${classes.frame} ${className ? className : ''}`}>
      {navConfig.map(({ name, href }) => (
        <li className={`${classes.item}`} key={href}>
          <Link
            // activeClassName={classes.active}
            className={`${classes.link}`}
            to={href}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TabsNav;
