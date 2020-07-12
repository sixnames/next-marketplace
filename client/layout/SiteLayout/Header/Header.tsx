import React, { useCallback, useRef } from 'react';
import Inner from '../../../components/Inner/Inner';
import HeaderSearch from './HeaderSearch';
import HeaderUi from './HeaderUI';
import HeaderNav from './HeaderNav';
import useIsMobile from '../../../hooks/useIsMobile';
import HeaderMobile from './HeaderMobile';
import Link from 'next/link';
import classes from './Header.module.css';
import { useThemeContext } from '../../../context/themeContext';
import Icon from '../../../components/Icon/Icon';
import TTip from '../../../components/TTip/TTip';
import Cookies from 'js-cookie';
import { DEFAULT_LANG, IS_BROWSER, LANG_COOKIE_KEY, SECONDARY_LANG } from '../../../config';
import { useSiteContext } from '../../../context/siteContext';

// TODO set lang in getServerSideProps
const Header: React.FC = () => {
  const { toggleTheme, themeIcon, themeTooltip } = useThemeContext();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement | null>(null);
  const { lang } = useSiteContext();
  const languageIsRussian = lang === DEFAULT_LANG;
  const languageIsEnglish = lang === SECONDARY_LANG;

  const languageHandler = useCallback((lang: string) => {
    Cookies.set(LANG_COOKIE_KEY, lang);
    if (IS_BROWSER) {
      window.location.reload();
    }
  }, []);

  return (
    <header className={classes.frame} ref={headerRef}>
      <div className={classes.top}>
        <Inner lowTop lowBottom className={classes.inner}>
          <div className={classes.language}>
            <div
              onClick={() => languageHandler(DEFAULT_LANG)}
              className={`${classes.languageItem} ${
                languageIsRussian ? classes.languageItemActive : ''
              }`}
            >
              {DEFAULT_LANG}
            </div>
            <div
              onClick={() => languageHandler(SECONDARY_LANG)}
              className={`${classes.languageItem} ${
                languageIsEnglish ? classes.languageItemActive : ''
              }`}
            >
              {SECONDARY_LANG}
            </div>
          </div>

          <ul className={classes.topNav}>
            {/*<li className={classes.topNavItem}>
              <Link href={'/about'}>
                <a>Наши кейсы</a>
              </Link>
            </li>*/}
          </ul>

          <div className={classes.topRight}>
            <a href={`tel:contactPhone`}>contactPhone</a>

            <div className={classes.topNavItem}>
              <div className={classes.topLink}>Заказать звонок</div>
            </div>

            <TTip
              onClick={toggleTheme}
              tooltipPlacement={'bottom'}
              title={themeTooltip}
              className={`${classes.topNavItem}`}
            >
              <Icon className={classes.topNavItemIcon} name={themeIcon} />
            </TTip>
          </div>
        </Inner>
      </div>

      <Inner className={classes.middle} lowTop lowBottom>
        <Link href={'/'}>
          <a className={classes.logo} aria-label={'Company logo'} />
        </Link>

        <HeaderSearch />

        {isMobile && <HeaderMobile headerRef={headerRef} />}

        <HeaderUi />
      </Inner>
      {!isMobile && <HeaderNav />}
    </header>
  );
};

export default Header;
