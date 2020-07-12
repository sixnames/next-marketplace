import React, { useRef } from 'react';
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
import { DEFAULT_LANG, SECONDARY_LANG } from '../../../config';
import { useLanguageContext } from '../../../context/languageContext';

// TODO set lang in getServerSideProps
const Header: React.FC = () => {
  const { toggleTheme, themeIcon, themeTooltip } = useThemeContext();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement | null>(null);
  const {
    languageIsRussian,
    languageIsEnglish,
    setEnglishLanguage,
    setRussianLanguage,
  } = useLanguageContext();

  return (
    <header className={classes.frame} ref={headerRef}>
      <div className={classes.top}>
        <Inner lowTop lowBottom className={classes.inner}>
          <div className={classes.language}>
            <div
              onClick={setRussianLanguage}
              className={`${classes.languageItem} ${
                languageIsRussian ? classes.languageItemActive : ''
              }`}
            >
              {DEFAULT_LANG}
            </div>
            <div
              onClick={setEnglishLanguage}
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
