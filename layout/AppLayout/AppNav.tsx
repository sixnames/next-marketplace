import { NavItemModel } from 'db/dbModels';
import useSignOut from 'hooks/useSignOut';
import AppNavItem from 'layout/AppLayout/AppNavItem';
import AppNavUser from 'layout/AppLayout/AppNavUser';
import * as React from 'react';
import Icon from '../../components/Icon/Icon';
import Link from '../../components/Link/Link';
import { useRouter } from 'next/router';
import classes from './AppNav.module.css';
import ThemeTrigger from '../../components/ThemeTrigger/ThemeTrigger';
import { useAppContext } from 'context/appContext';
import Tooltip from '../../components/TTip/Tooltip';
import { UseCompactReturnInterface } from 'hooks/useCompact';

interface AppNavInterface {
  compact: UseCompactReturnInterface;
  navItems: NavItemModel[];
}

const AppNav: React.FC<AppNavInterface> = ({ compact, navItems }) => {
  const signOut = useSignOut();
  const { pathname } = useRouter();
  const { isMobile } = useAppContext();
  const { isCompact, toggleCompactHandler, setCompactOff, setCompactOn } = compact;

  const mobileNavHandler = React.useCallback(toggleCompactHandler, [toggleCompactHandler]);
  const closeNavHandler = React.useCallback(setCompactOn, [setCompactOn]);
  const openNavHandler = React.useCallback(setCompactOff, [setCompactOff]);

  return (
    <nav className={classes.frame}>
      <div className={`${classes.collapse}`} onClick={mobileNavHandler}>
        <Icon name='burger' className={classes.collapseIcon} />
      </div>

      <div className={`${classes.nav} ${isCompact && classes.navCompact}`}>
        <div className={classes.holder}>
          <AppNavUser compact={isCompact} openNavHandler={openNavHandler} />

          <div className={`${classes.list} ${isCompact ? classes.listClosed : ''}`}>
            <ul className={classes.listHolder}>
              {navItems.map((item) => {
                return (
                  <AppNavItem
                    compact={isCompact}
                    key={`${item._id}`}
                    item={item}
                    pathname={pathname}
                    openNavHandler={openNavHandler}
                    closeNavHandler={closeNavHandler}
                  />
                );
              })}

              <li className={`${classes.bottom} ${classes.bottomFirst}`}>
                <Tooltip title={isCompact ? 'Вернуться на сайт' : null}>
                  <div>
                    <Link
                      href={`/`}
                      className={`${classes.bottomLink} ${
                        isCompact ? classes.bottomLinkCompact : ''
                      }`}
                    >
                      <Icon name={'chevron-left'} className={classes.bottomIcon} />
                      <span
                        className={`${classes.bottomText} ${
                          isCompact ? classes.bottomTextCompact : ''
                        }`}
                      >
                        Вернуться в каталог
                      </span>
                    </Link>
                  </div>
                </Tooltip>
              </li>

              <li className={`${classes.bottom} ${classes.bottom}`}>
                <Tooltip title={isCompact ? 'Выйти из аккаунта' : null}>
                  <div
                    onClick={signOut}
                    className={`${classes.bottomLink} ${
                      isCompact ? classes.bottomLinkCompact : ''
                    }`}
                  >
                    <Icon name={'exit'} className={classes.bottomIcon} />
                    <span
                      className={`${classes.bottomText} ${
                        isCompact ? classes.bottomTextCompact : ''
                      }`}
                    >
                      Выйти из аккаунта
                    </span>
                  </div>
                </Tooltip>
              </li>

              <li className={`${classes.bottom} ${classes.bottom}`}>
                <div
                  className={`${classes.bottomLink} ${isCompact ? classes.bottomLinkCompact : ''}`}
                >
                  <ThemeTrigger isCompact={isCompact} />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {!isCompact && isMobile ? (
        <div className={classes.backdrop} onClick={closeNavHandler} />
      ) : null}
    </nav>
  );
};

export default AppNav;
