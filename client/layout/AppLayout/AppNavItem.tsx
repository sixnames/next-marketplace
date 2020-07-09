import React, { useEffect, useState } from 'react';
import TTip from '../../components/TTip/TTip';
import Icon from '../../components/Icon/Icon';
import Link from '../../components/Link/Link';
import { ROUTE_SIGN_OUT } from '../../config';
import { NavItemInterface } from '../../types';
import classes from './AppNavItem.module.css';

interface AppNavItemInterface {
  item: NavItemInterface;
  compact?: boolean;
  pathname: string;
  signOutHandler: () => void;
  openNavHandler: () => void;
  closeNavHandler: () => void;
}

const AppNavItem: React.FC<AppNavItemInterface> = ({
  item,
  compact,
  signOutHandler,
  openNavHandler,
  closeNavHandler,
  pathname,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
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
      setIsOpen(true);
    } else {
      setIsOpen((prevState) => !prevState);
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
          className={`${classes.dropdown} ${isOpen ? classes.dropdownActive : ''} ${
            compact ? classes.dropdownCompact : ''
          }`}
        >
          {children.map((dropdownItem) => {
            const { name, path } = dropdownItem;

            return (
              <li className={classes.item} onClick={closeNavHandler} key={name}>
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

  if (path === ROUTE_SIGN_OUT) {
    return (
      <li className={classes.item}>
        <TTip tooltipPlacement={'right'} title={compact ? name : ''}>
          <div
            className={`${classes.link} ${compact ? classes.linkCompact : ''}`}
            onClick={signOutHandler}
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
          </div>
        </TTip>
      </li>
    );
  }

  return (
    <li className={classes.item} onClick={closeNavHandler}>
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