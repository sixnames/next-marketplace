import React, { useCallback } from 'react';
import AppNavUser from './AppNavUser';
import AppNavItem from './AppNavItem';
import { UseCompactReturnInterface } from '../../hooks/useCompact';
import Icon from '../../components/Icon/Icon';
import AnimateOpacity from '../../components/AnimateOpacity/AnimateOpacity';
import TTip from '../../components/TTip/TTip';
import Link from '../../components/Link/Link';
import { useRouter } from 'next/router';
import useSignOut from '../../hooks/useSignOut';
import classes from './AppNav.module.css';
import { useThemeContext } from '../../context/themeContext';
import useIsMobile from '../../hooks/useIsMobile';
import { useAppNavContext } from '../../context/appNavContext';

interface AppNavInterface {
  compact: UseCompactReturnInterface;
}

const AppNav: React.FC<AppNavInterface> = ({ compact }) => {
  const { pathname } = useRouter();
  const { navItems } = useAppNavContext();
  const isMobile = useIsMobile();
  const { toggleTheme, isDark, themeTooltip } = useThemeContext();
  const signOutHandler = useSignOut();
  const { isCompact, toggleCompactHandler, setCompactOff, setCompactOn } = compact;

  const mobileNavHandler = useCallback(toggleCompactHandler, [toggleCompactHandler]);
  const closeNavHandler = useCallback(setCompactOn, [setCompactOn]);
  const openNavHandler = useCallback(setCompactOff, [setCompactOff]);

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
                    key={item.nameString}
                    item={item}
                    pathname={pathname}
                    openNavHandler={openNavHandler}
                    closeNavHandler={closeNavHandler}
                  />
                );
              })}

              <li className={`${classes.bottom} ${classes.bottomFirst}`}>
                <TTip tooltipPlacement={'right'} title={isCompact ? 'Вернуться на сайт' : ''}>
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
                </TTip>
              </li>

              <li className={`${classes.bottom} ${classes.bottom}`}>
                <TTip tooltipPlacement={'right'} title={isCompact ? 'Выйти из аккаунта' : ''}>
                  <div
                    onClick={signOutHandler}
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
                </TTip>
              </li>

              <li className={classes.bottom} onClick={toggleTheme}>
                <TTip tooltipPlacement={'right'} title={isCompact ? themeTooltip : ''}>
                  <div
                    className={`${classes.bottomLink} ${
                      isCompact ? classes.bottomLinkCompact : ''
                    }`}
                  >
                    {isDark ? (
                      <Icon className={classes.bottomIcon} name={'moon'} />
                    ) : (
                      <Icon className={classes.bottomIcon} name={'sun'} />
                    )}

                    <span
                      className={`${classes.bottomText} ${
                        isCompact ? classes.bottomTextCompact : ''
                      }`}
                    >
                      {themeTooltip}
                    </span>
                  </div>
                </TTip>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {!isCompact && isMobile && (
        <AnimateOpacity className={classes.backdrop} onClick={closeNavHandler} />
      )}
    </nav>
  );
};

export default AppNav;
