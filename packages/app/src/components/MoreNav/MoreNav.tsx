import React, { useState } from 'react';
import Icon from '../Icon/Icon';
import AnimateOpacity from '../AnimateOpacity/AnimateOpacity';
import { NavItemInterface } from '../../types';
import classes from './MoreNav.module.css';
import Backdrop from '../Backdrop/Backdrop';
import { NavLink } from 'react-router-dom';
import useRouterQuery from '../../hooks/useRouterQuery';

interface MoreNavInterface {
  navConfig: NavItemInterface[];
  className?: string;
}

const MoreNav: React.FC<MoreNavInterface> = ({ navConfig, className }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { search } = useRouterQuery();

  function toggleDropdownHandler() {
    setIsDropdownOpen((prevState) => !prevState);
  }

  function hideDropdownHandler() {
    setIsDropdownOpen(false);
  }

  return (
    <div className={`${classes.frame} ${className ? className : ''}`}>
      <div className={classes.trigger} onClick={toggleDropdownHandler} data-cy={`more-nav-trigger`}>
        <Icon name={'MoreVert'} className={classes.triggerIcon} />
      </div>

      {isDropdownOpen && (
        <AnimateOpacity className={classes.list}>
          <div className={classes.listContent} data-cy={'user-nav-container'}>
            <ul data-cy={`more-nav-list`}>
              {navConfig.map(({ to = '', name, icon, hidden, testId }) => {
                if (hidden) {
                  return null;
                }

                const isCurrentLink = to.search === search;

                return (
                  <li
                    className={`${classes.item} ${isCurrentLink ? classes.linkActive : ''}`}
                    key={name}
                    data-cy={`more-nav-item-${testId}`}
                  >
                    <NavLink to={to} className={classes.link} onClick={hideDropdownHandler}>
                      {icon && <Icon name={icon} className={classes.icon} />}
                      <span className={classes.linkName}>{name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <Backdrop onClick={hideDropdownHandler} testId={`more-nav-close`} />
        </AnimateOpacity>
      )}
    </div>
  );
};

export default MoreNav;
