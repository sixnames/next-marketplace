import ControlButton from 'components/ControlButton';
import { NavItemModel } from 'db/dbModels';
import { CompanyInterface } from 'db/uiInterfaces';
import useSignOut from 'hooks/useSignOut';
import * as React from 'react';
import CmsNavUser from 'layout/CmsLayout/CmsNavUser';
import CmsNavItem from 'layout/CmsLayout/CmsNavItem';
import Icon from 'components/Icon';
import Link from '../../components/Link/Link';
import { useRouter } from 'next/router';
import classes from 'layout/CmsLayout/CmsNav.module.css';
import ThemeTrigger from 'components/ThemeTrigger';
import { useAppContext } from 'context/appContext';
import Tooltip from 'components/Tooltip';
import { UseCompactReturnInterface } from 'hooks/useCompact';

interface AppNavInterface {
  compact: UseCompactReturnInterface;
  navItems: NavItemModel[];
  basePath: string;
  company?: CompanyInterface;
}

const CmsNav: React.FC<AppNavInterface> = ({ compact, basePath, company, navItems }) => {
  const signOut = useSignOut();
  const { pathname } = useRouter();
  const { isMobile } = useAppContext();
  const { isCompact, toggleCompactHandler, setCompactOff, setCompactOn } = compact;

  const mobileNavHandler = React.useCallback(toggleCompactHandler, [toggleCompactHandler]);
  const closeNavHandler = React.useCallback(setCompactOn, [setCompactOn]);
  const openNavHandler = React.useCallback(setCompactOff, [setCompactOff]);

  return (
    <nav className={classes.frame}>
      <div className={`${classes.collapse}`}>
        {isCompact ? null : (
          <div className='pl-[10px] text-secondary-text'>
            <ThemeTrigger staticColors />
          </div>
        )}
        <ControlButton icon={'burger'} onClick={mobileNavHandler} />
      </div>

      <div className={`${classes.nav} ${isCompact && classes.navCompact}`}>
        <div className={classes.holder}>
          <CmsNavUser compact={isCompact} openNavHandler={openNavHandler} />

          <div className={`${classes.list} ${isCompact ? classes.listClosed : ''}`}>
            <ul className={classes.listHolder}>
              {navItems.map((item) => {
                return (
                  <CmsNavItem
                    companyId={company ? `${company._id}` : undefined}
                    basePath={basePath}
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
                    data-cy={'sign-out'}
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

export default CmsNav;
