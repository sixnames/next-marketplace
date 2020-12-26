import React, { useEffect, useState } from 'react';
import Icon from '../../components/Icon/Icon';
import Link from '../../components/Link/Link';
import classes from './AppNavItem.module.css';
import useCompact from '../../hooks/useCompact';
import { NavItemType } from '../../context/appNavContext';
import { IconType } from '@yagu/shared';
import Tooltip from '../../components/TTip/Tooltip';

interface AppNavItemInterface {
  item: NavItemType;
  compact?: boolean;
  pathname: string;
  openNavHandler: () => void;
  closeNavHandler: () => void;
}

const AppNavItem: React.FC<AppNavItemInterface> = ({ item, compact, openNavHandler, pathname }) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const { isCompact, setCompactOn, toggleCompactHandler } = useCompact(isDropdownActive);
  const { nameString, icon, path, children } = item;
  const iconType = icon as IconType;

  useEffect(() => {
    if (children) {
      const pathnameArr = pathname.split('/[');
      const realPathname = pathnameArr[0];
      const paths = children.map(({ path }) => path).map((path) => `${path}`.split('?')[0]);
      const current = paths.includes(realPathname);
      if (current) {
        setIsDropdownActive(true);
      }
    }

    return () => {
      setIsDropdownActive(false);
    };
  }, [children, pathname]);

  function dropdownNavHandler() {
    if (compact) {
      openNavHandler();
      setCompactOn();
    } else {
      toggleCompactHandler();
    }
  }

  if (children && children.length) {
    return (
      <li className={classes.item} data-cy={`app-nav-item-${nameString}`}>
        <Tooltip title={compact ? nameString : null}>
          <div
            className={`${classes.complexItem} ${compact ? classes.complexItemCompact : ''} ${
              isDropdownActive ? classes.complexItemActive : ''
            }`}
            onClick={dropdownNavHandler}
          >
            {icon && (
              <span className={`${classes.linkIcon}`}>
                <Icon name={iconType} />
              </span>
            )}
            <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
              {nameString}
            </span>
          </div>
        </Tooltip>

        <ul
          className={`${classes.dropdown} ${isCompact ? classes.dropdownActive : ''} ${
            compact ? classes.dropdownCompact : ''
          }`}
        >
          {children.map((dropdownItem) => {
            const { nameString, path } = dropdownItem;

            return (
              <li className={classes.item} key={nameString} data-cy={`app-nav-item-${nameString}`}>
                <Link
                  href={`${path}`}
                  className={`${classes.complexLink}`}
                  activeClassName={classes.linkActive}
                >
                  <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
                    {nameString}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    );
  }

  return (
    <li className={classes.item} data-cy={`app-nav-item-${nameString}`}>
      <Tooltip title={compact ? nameString : ''}>
        <div>
          <Link
            href={`${path}`}
            className={`${classes.link} ${compact ? classes.linkCompact : ''}`}
            activeClassName={classes.linkActive}
          >
            <span className={`${classes.linkIcon}`}>
              {icon && (
                <span className={`${classes.linkIcon}`}>
                  <Icon name={iconType} />
                </span>
              )}
            </span>
            <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
              {nameString}
            </span>
          </Link>
        </div>
      </Tooltip>
    </li>
  );
};

export default AppNavItem;
