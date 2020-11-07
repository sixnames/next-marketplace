import React, { useEffect, useState } from 'react';
import TTip from '../../components/TTip/TTip';
import Icon from '../../components/Icon/Icon';
import Link from '../../components/Link/Link';
import classes from './AppNavItem.module.css';
import useCompact from '../../hooks/useCompact';
import { NavItemType } from '../../context/appNavContext';
import { IconType } from '@yagu/config';

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
      const paths = children.map(({ path }) => path).map((path) => `${path}`.split('?')[0]);
      const current = paths.includes(pathname);
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
        <TTip
          className={`${classes.complexItem} ${compact ? classes.complexItemCompact : ''} ${
            isDropdownActive ? classes.complexItemActive : ''
          }`}
          onClick={dropdownNavHandler}
          tooltipPlacement={'right'}
          title={compact ? nameString : ''}
        >
          {icon && (
            <span className={`${classes.linkIcon}`}>
              <Icon name={iconType} />
            </span>
          )}
          <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
            {nameString}
          </span>
        </TTip>

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
      <TTip tooltipPlacement={'right'} title={compact ? nameString : ''}>
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
      </TTip>
    </li>
  );
};

export default AppNavItem;
