import React, { useState, Fragment } from 'react';
import Link from '../Link/Link';
import Icon from '../Icon/Icon';
import AnimateOpacity from '../AnimateOpacity/AnimateOpacity';
import { NavItemInterface } from '../../types';
import classes from './MoreNav.module.css';
import Backdrop from '../Backdrop/Backdrop';

interface MoreNavInterface {
  navConfig: NavItemInterface[];
  className?: string;
}

const MoreNav: React.FC<MoreNavInterface> = ({ navConfig, className }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function toggleDropdownHandler() {
    setIsDropdownOpen((prevState) => !prevState);
  }

  function hideDropdownHandler() {
    setIsDropdownOpen(false);
  }

  return (
    <div className={`${classes.frame} ${className ? className : ''}`}>
      <div className={classes.trigger} onClick={toggleDropdownHandler} data-cy={`more-nav-trigger`}>
        <Icon name={'three-dots-vertical'} className={classes.triggerIcon} />
      </div>

      {isDropdownOpen && (
        <AnimateOpacity className={classes.list}>
          <div className={classes.listContent} data-cy={'user-nav-container'}>
            <ul>
              {navConfig.map(({ path = '', name, icon, hidden, testId }) => {
                if (hidden) {
                  return null;
                }

                return (
                  <li className={classes.item} data-cy={`more-nav-list`} key={name}>
                    <Link
                      exact
                      href={path}
                      activeClassName={classes.linkActive}
                      className={classes.link}
                      onClick={hideDropdownHandler}
                      testId={`more-nav-item-${testId}`}
                    >
                      {(isCurrent: boolean) => (
                        <Fragment>
                          {icon && (
                            <Icon
                              name={icon}
                              className={`${classes.icon} ${isCurrent ? classes.iconActive : ''}`}
                            />
                          )}
                          <span className={classes.linkName}>{name}</span>
                        </Fragment>
                      )}
                    </Link>
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
