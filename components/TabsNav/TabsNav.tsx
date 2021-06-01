import * as React from 'react';
import Link from '../Link/Link';
import classes from './TabsNav.module.css';
import { ClientNavItemInterface } from 'types/clientTypes';

export interface TabsNavItemInterface extends ClientNavItemInterface {
  path: string;
}

interface TabsNavInterface {
  navConfig: TabsNavItemInterface[];
  className?: string;
}

const TabsNav: React.FC<TabsNavInterface> = ({ navConfig, className }) => {
  return (
    <ul className={`${classes.frame} ${className ? className : ''}`}>
      {navConfig.map(({ name, path }, index) => (
        <li className={`${classes.item}`} key={name}>
          <Link
            activeClassName={classes.active}
            className={`${classes.link}`}
            href={path}
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
