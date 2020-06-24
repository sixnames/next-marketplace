import React, { useEffect, useState } from 'react';
import TTip from '../TTip/TTip';
import Icon from '../Icon/Icon';
import { NavItemInterface } from '../../types';
import { NavLink } from 'react-router-dom';
import classes from './AppNavItem.module.css';
import { ROUTE_SIGN_OUT } from '../../config';

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
  const { name, icon, to, children, counter } = item;

  useEffect(() => {
    const basePath = '/app';

    if (children) {
      const paths = children.map(({ to }) => {
        if (typeof to === 'string') {
          return `${basePath}/${to}`;
        }
        return `${basePath}/${to.pathname}`;
      });

      if (paths.includes(pathname)) {
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
            const { name, to } = dropdownItem;

            return (
              <li className={classes.item} onClick={closeNavHandler} key={name}>
                <NavLink
                  to={to}
                  className={`${classes.complexLink}`}
                  activeClassName={classes.linkActive}
                >
                  <span className={`${classes.linkText} ${compact ? classes.linkTextCompact : ''}`}>
                    {name}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </li>
    );
  }

  if (to === ROUTE_SIGN_OUT) {
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
        <NavLink
          to={`${to}`}
          className={`${classes.link} ${compact ? classes.linkCompact : ''}`}
          activeClassName={classes.linkActive}
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
        </NavLink>
      </TTip>
    </li>
  );
};

export default AppNavItem;
