import React, { useRef } from 'react';
import { Fragment } from 'react';
import classes from './Header.module.css';
import StickyNav from './StickyNav';
import HeaderTop from './HeaderTop';
import Link from '../../../components/Link/Link';
import { useThemeContext } from '../../../context/themeContext';
import { useConfigContext } from '../../../context/configContext';
import { ASSETS_URL, ROUTE_PROFILE, ROUTE_SIGN_IN } from '../../../config';
import Icon from '../../../components/Icon/Icon';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from '../../../context/siteContext';
import HeaderSearch from './HeaderSearch';
import { useUserContext } from '../../../context/userContext';
import { useAppContext } from '../../../context/appContext';
import CounterSticker from '../../../components/CounterSticker/CounterSticker';

const HeaderBurgerDropdownTrigger: React.FC = () => {
  const { isBurgerDropdownOpen, toggleBurgerDropdown } = useSiteContext();
  return (
    <div
      data-cy={`burger-trigger`}
      onClick={toggleBurgerDropdown}
      className={`${classes.middleLink} ${classes.middleLinkBurger} ${
        isBurgerDropdownOpen ? classes.middleLinkActive : ''
      }`}
    >
      <div className={`${classes.middleLinkIconHolder}`}>
        <Icon name={'burger'} className={classes.middleLinkBurgerIcon} />
      </div>
      <span>меню</span>
    </div>
  );
};

const HeaderSearchTrigger: React.FC = () => {
  const { isSearchOpen, showSearchDropdown } = useSiteContext();
  return (
    <div
      data-cy={'search-trigger'}
      onClick={showSearchDropdown}
      className={`${classes.middleLink} ${isSearchOpen ? classes.middleLinkActive : ''}`}
    >
      <div className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}>
        <Icon name={'search'} className={classes.middleLinkSearchIcon} />
      </div>
    </div>
  );
};

const HeaderProfileLink: React.FC = () => {
  const { me } = useUserContext();
  return (
    <Link
      testId={me ? `profile-link` : `sign-in-link`}
      href={me ? ROUTE_PROFILE : ROUTE_SIGN_IN}
      className={`${classes.middleLink}`}
    >
      <span className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}>
        <Icon name={'user'} className={classes.middleLinkUserIcon} />
      </span>
    </Link>
  );
};

const HeaderCartLink: React.FC = () => {
  const { cart } = useSiteContext();
  return (
    <div className={`${classes.middleLink}`}>
      <div className={`${classes.middleLinkIconHolder}`}>
        <Icon name={'cart'} className={classes.middleLinkCartIcon} />
        <CounterSticker value={cart.productsCount} testId={'cart-counter'} />
      </div>
      <span>Корзина</span>
    </div>
  );
};

const HeaderMiddleLeft: React.FC = () => {
  return (
    <div className={classes.middleSide}>
      <HeaderBurgerDropdownTrigger />

      <div className={`${classes.middleLink}`}>
        <div className={`${classes.middleLinkIconHolder}`}>
          <Icon name={'marker'} className={classes.middleLinkShopsIcon} />
        </div>
        <span>Винотеки</span>
      </div>
    </div>
  );
};

const HeaderMiddleRight: React.FC = () => {
  return (
    <div className={classes.middleSide}>
      <HeaderSearchTrigger />
      <HeaderProfileLink />

      <div className={`${classes.middleLink}`}>
        <div className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}>
          <Icon name={'compare'} className={classes.middleLinkCompareIcon} />
        </div>
      </div>
      <div className={`${classes.middleLink}`}>
        <div className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}>
          <Icon name={'heart'} className={classes.middleLinkHeartIcon} />
        </div>
      </div>

      <HeaderCartLink />
    </div>
  );
};

const Header: React.FC = () => {
  const { isSearchOpen } = useSiteContext();
  const { logoSlug } = useThemeContext();
  const { isMobile } = useAppContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const headerRef = useRef<HTMLElement | null>(null);

  const siteLogo = getSiteConfigSingleValue(logoSlug);
  const siteLogoSrc = `${ASSETS_URL}${siteLogo}?format=svg`;

  const configSiteName = getSiteConfigSingleValue('siteName');

  return (
    <Fragment>
      <header className={classes.frame} ref={headerRef}>
        {isMobile ? null : <HeaderTop />}
        <Inner className={classes.middle} lowTop>
          {isMobile ? null : <HeaderMiddleLeft />}

          <Link href={'/'} className={classes.middleLogo} aria-label={'Главная страница'}>
            <img src={siteLogoSrc} width='166' height='27' alt={configSiteName} />
          </Link>

          {isMobile ? null : <HeaderMiddleRight />}
        </Inner>

        {isSearchOpen ? <HeaderSearch /> : null}
      </header>

      {isMobile ? (
        <div className={classes.mobileNav}>
          <Inner className={classes.mobileNavInner}>
            <HeaderBurgerDropdownTrigger />

            <div className={classes.mobileNavRight}>
              <HeaderSearchTrigger />
              <HeaderProfileLink />
              <HeaderCartLink />
            </div>
          </Inner>
        </div>
      ) : (
        <StickyNav />
      )}
    </Fragment>
  );
};

export default Header;
