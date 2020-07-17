import React, { useEffect, useState } from 'react';
import TTip from '../../components/TTip/TTip';
import Icon from '../../components/Icon/Icon';
import Link from '../../components/Link/Link';
import { NavItemInterface } from '../../types';
import classes from './AppNavItem.module.css';
import useCompact from '../../hooks/useCompact';

interface AppNavItemInterface {
  item: NavItemInterface;
  compact?: boolean;
  pathname: string;
  openNavHandler: () => void;
  closeNavHandler: () => void;
}

const AppNavItem: React.FC<AppNavItemInterface> = ({ item, compact, openNavHandler, pathname }) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const { isCompact, setCompactOn, toggleCompactHandler } = useCompact(isDropdownActive);
  const { name, icon, counter, path, children } = item;

  useEffect(() => {
    if (children) {
      const paths = children.map(({ path }) => {
        if (typeof path === 'string') {
          return path;
        }
        return path.pathname;
      });

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

  if (children) {
    return (
      <li className={classes.item}>
        <TTip
          className={`${classes.complexItem} ${compact ? classes.complexItemCompact : ''} ${
            isDropdownActive ? classes.complexItemActive : ''
          }`}
          onClick={dropdownNavHandler}
          tooltipPlacement={'right'}
          title={compact ? name : ''}
        >
          {icon && (
            <span className={`${classes.linkIcon}`}>
              <Icon name={icon} />
            </span>
          )}
          <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
            {name}
          </span>
        </TTip>

        <ul
          className={`${classes.dropdown} ${isCompact ? classes.dropdownActive : ''} ${
            compact ? classes.dropdownCompact : ''
          }`}
        >
          {children.map((dropdownItem) => {
            const { name, path } = dropdownItem;

            return (
              <li className={classes.item} key={name}>
                <Link
                  href={path}
                  className={`${classes.complexLink}`}
                  activeClassName={classes.linkActive}
                >
                  <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
                    {name}
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
    <li className={classes.item}>
      <TTip tooltipPlacement={'right'} title={compact ? name : ''}>
        <Link
          href={`${path}`}
          className={`${classes.link} ${compact ? classes.linkCompact : ''}`}
          activeClassName={classes.LinkActive}
        >
          <span className={`${classes.linkIcon}`}>
            {icon && (
              <span className={`${classes.linkIcon}`}>
                <Icon name={icon} />
              </span>
            )}
          </span>
          <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
            {name}
          </span>
          {counter && counter > 0 ? (
            <span className={`${classes.counter} ${compact ? classes.counterCompact : ''}`}>
              {counter}
            </span>
          ) : null}
        </Link>
      </TTip>
    </li>
  );
};

export default AppNavItem;
