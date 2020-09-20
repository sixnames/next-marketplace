import React from 'react';
import Link from '../Link/Link';
import { NavItemInterface, PathInterface } from '../../types';
import classes from './TabsNav.module.css';

export interface TabsNavItemInterface extends NavItemInterface {
  path: string | PathInterface;
}

interface TabsNavInterface {
  navConfig: TabsNavItemInterface[];
  className?: string;
}

const TabsNav: React.FC<TabsNavInterface> = ({ navConfig, className }) => {
  return (
    <ul className={`${classes.frame} ${className ? className : ''}`}>
      {navConfig.map(({ name, path, as }, index) => (
        <li className={`${classes.item}`} key={name}>
          <Link
            activeClassName={classes.active}
            className={`${classes.link}`}
            href={path}
            as={as}
            testId={`tab-${index}`}
            replace
            isTab
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TabsNav;
