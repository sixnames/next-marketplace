import useCart from 'hooks/useCart';
import useSignOut from 'hooks/useSignOut';
import LayoutCard from 'layout/LayoutCard/LayoutCard';
import * as React from 'react';
import classes from './Header.module.css';
import StickyNav from './StickyNav';
import HeaderTop from './HeaderTop';
import Link from '../../../components/Link/Link';
import { useThemeContext } from 'context/themeContext';
import { useConfigContext } from 'context/configContext';
import Icon from '../../../components/Icon/Icon';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from 'context/siteContext';
import HeaderSearch from './HeaderSearch';
import { useUserContext } from 'context/userContext';
import { useAppContext } from 'context/appContext';
import CounterSticker from '../../../components/CounterSticker/CounterSticker';
import { Menu, MenuButton, MenuPopover } from '@reach/menu-button';
import CartDropdown from './CartDropdown';
import { CartFragment } from 'generated/apolloComponents';
import {
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_COMPANY_MANAGER,
  ROLE_SLUG_COMPANY_OWNER,
  ROUTE_APP,
  ROUTE_CMS,
  ROUTE_PROFILE,
  ROUTE_SIGN_IN,
} from 'config/common';
import Image from 'next/image';

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
  const signOut = useSignOut();
  const { me } = useUserContext();

  if (me) {
    return (
      <Menu>
        {() => {
          return (
            <React.Fragment>
              <MenuButton className={`${classes.middleLink}`} data-cy={'user-dropdown-trigger'}>
                <span
                  className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}
                >
                  <Icon name={'user'} className={classes.middleLinkUserIcon} />
                </span>
              </MenuButton>
              <MenuPopover>
                <LayoutCard>
                  <div className={classes.userDropdownTop}>
                    <div className={classes.userDropdownName}>{me?.shortName}</div>
                  </div>

                  <ul>
                    <li className={classes.userDropdownListItem}>
                      <Link className={classes.userDropdownListLink} href={ROUTE_PROFILE}>
                        <span>Личный кабинет</span>
                      </Link>
                    </li>

                    {me?.role.slug === ROLE_SLUG_ADMIN ? (
                      <li className={classes.userDropdownListItem}>
                        <Link className={classes.userDropdownListLink} href={ROUTE_CMS}>
                          <span>CMS</span>
                        </Link>
                      </li>
                    ) : null}

                    {me?.role.slug === ROLE_SLUG_COMPANY_MANAGER ||
                    me?.role.slug === ROLE_SLUG_COMPANY_OWNER ? (
                      <li className={classes.userDropdownListItem}>
                        <Link className={classes.userDropdownListLink} href={ROUTE_APP}>
                          <span>Панель управления</span>
                        </Link>
                      </li>
                    ) : null}

                    <li className={classes.userDropdownListItem} onClick={signOut}>
                      <span className={classes.userDropdownListLink}>Выйти из аккаунта</span>
                    </li>
                  </ul>
                </LayoutCard>
              </MenuPopover>
            </React.Fragment>
          );
        }}
      </Menu>
    );
  }

  return (
    <Link
      testId={me ? `profile-link` : `sign-in-link`}
      href={me ? ROUTE_PROFILE : ROUTE_SIGN_IN}
      className={`${classes.middleLink}`}
      activeClassName={`${classes.middleLinkActive}`}
    >
      <span className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}>
        <Icon name={'user'} className={classes.middleLinkUserIcon} />
      </span>
    </Link>
  );
};

interface HeaderCartDropdownButtonInterface {
  cart: CartFragment;
}

const HeaderCartDropdownButton: React.FC<HeaderCartDropdownButtonInterface> = ({ cart }) => {
  return (
    <React.Fragment>
      <MenuButton>
        <span
          data-cy={'cart-dropdown-trigger'}
          className={`${classes.middleLink} ${classes.middleLinkCart}`}
        >
          <span className={`${classes.middleLinkIconHolder}`}>
            <Icon name={'cart'} className={classes.middleLinkCartIcon} />
            <CounterSticker value={cart.productsCount} testId={'cart-counter'} />
          </span>
          <span>Корзина</span>
        </span>
      </MenuButton>
      <MenuPopover>
        <CartDropdown cart={cart} />
      </MenuPopover>
    </React.Fragment>
  );
};

const HeaderCartLink: React.FC = () => {
  const { cart } = useCart();

  if (cart && cart.productsCount > 0) {
    return (
      <Menu>
        {() => {
          return <HeaderCartDropdownButton cart={cart} />;
        }}
      </Menu>
    );
  }

  return (
    <span
      data-cy={'cart-dropdown-trigger'}
      className={`${classes.middleLink} ${classes.middleLinkCart}`}
    >
      <span className={`${classes.middleLinkIconHolder}`}>
        <Icon name={'cart'} className={classes.middleLinkCartIcon} />
      </span>
      <span>Корзина</span>
    </span>
  );
};

const HeaderMiddleLeft: React.FC = () => {
  return (
    <div className={classes.middleSide}>
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
  const { isMobile } = useAppContext();
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { logoSlug } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();

  const siteLogoSrc = getSiteConfigSingleValue(logoSlug);
  const configSiteName = getSiteConfigSingleValue('siteName');

  return (
    <React.Fragment>
      <header className={classes.header} ref={headerRef}>
        {isMobile ? null : <HeaderTop />}
        <Inner className={classes.middle} lowTop>
          {isMobile ? null : <HeaderMiddleLeft />}

          <Link href={`/`} className={classes.middleLogo} aria-label={'Главная страница'}>
            <Image src={siteLogoSrc} width={166} height={27} alt={configSiteName} />
          </Link>

          {isMobile ? null : <HeaderMiddleRight />}
        </Inner>

        {isSearchOpen ? <HeaderSearch /> : null}
      </header>

      {isMobile ? (
        <div className={classes.mobileNav}>
          <Inner className={classes.mobileNavInner}>
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
    </React.Fragment>
  );
};

export default Header;
