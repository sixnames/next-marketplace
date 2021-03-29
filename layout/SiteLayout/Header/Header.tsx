import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import LanguageTrigger from 'components/LanguageTrigger/LanguageTrigger';
import ThemeTrigger from 'components/ThemeTrigger/ThemeTrigger';
import useCart from 'hooks/useCart';
import useSignOut from 'hooks/useSignOut';
import LayoutCard from 'layout/LayoutCard/LayoutCard';
import { alwaysArray } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import classes from './Header.module.css';
import StickyNav from './StickyNav';
import Link from '../../../components/Link/Link';
import { useThemeContext } from 'context/themeContext';
import { useConfigContext } from 'context/configContext';
import Icon from '../../../components/Icon/Icon';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from 'context/siteContext';
import HeaderSearch from './HeaderSearch';
import { useUserContext } from 'context/userContext';
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
      ariaLabel={'Войти'}
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

interface HeaderBurgerDropdownTriggerInterface {
  isBurgerDropdownOpen: boolean;
  toggleBurgerDropdown: () => void;
}

const HeaderBurgerDropdownTrigger: React.FC<HeaderBurgerDropdownTriggerInterface> = ({
  isBurgerDropdownOpen,
  toggleBurgerDropdown,
}) => {
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

interface BurgerDropdownInterface {
  isBurgerDropdownOpen: boolean;
  hideBurgerDropdown: () => void;
}

const BurgerDropdown: React.FC<BurgerDropdownInterface> = ({
  isBurgerDropdownOpen,
  hideBurgerDropdown,
}) => {
  const { query, asPath } = useRouter();
  const { navRubrics } = useSiteContext();

  if (!isBurgerDropdownOpen) {
    return null;
  }

  return (
    <div className={classes.burgerDropdown}>
      <Inner className={classes.burgerDropdownInner}>
        <div className={classes.burgerDropdownTop}>
          <ThemeTrigger />
          <LanguageTrigger />
        </div>

        <ul>
          {navRubrics.map((rubric) => {
            const { catalogue = [], card = [] } = query;
            const realCatalogueQuery = alwaysArray(catalogue);
            const catalogueSlug = realCatalogueQuery[0];
            const { name, slug, navItems } = rubric;

            // Get rubric slug from product card path
            const cardSlugs: string[] = alwaysArray(card).slice(0, card.length - 1);
            const cardSlugsParts = cardSlugs.map((slug) => {
              return slug.split('-');
            });
            const rubricSlugArr = cardSlugsParts.find((part) => part[0] === 'rubric');
            const rubricSlug = rubricSlugArr ? rubricSlugArr[1] : '';
            const isCurrent = slug === catalogueSlug || rubricSlug === rubric.slug;

            return (
              <li className={classes.burgerDropdownListItem} key={rubric.slug}>
                <Link
                  prefetch={false}
                  href={`/${slug}`}
                  onClick={hideBurgerDropdown}
                  testId={`main-rubric-${rubric.name}`}
                  className={`${classes.burgerDropdownListItemLink} ${
                    isCurrent ? classes.burgerDropdownListItemLinkCurrent : ''
                  }`}
                >
                  {name}
                </Link>
                <Disclosure>
                  <DisclosurePanel>
                    <div>
                      {(navItems || []).map(({ _id, options, name }) => {
                        return (
                          <div className={classes.burgerDropdownListItemGroup} key={`${_id}`}>
                            <div className={classes.burgerDropdownListItemGroupTitle}>{name}</div>
                            <ul>
                              {options.map((option) => {
                                const isCurrent = asPath === option.slug;
                                return (
                                  <li key={`${option._id}`}>
                                    <Link
                                      href={`/${rubric.slug}/${option.slug}`}
                                      onClick={hideBurgerDropdown}
                                      className={`${classes.burgerDropdownListItemGroupLink} ${
                                        isCurrent
                                          ? classes.burgerDropdownListItemGroupLinkCurrent
                                          : ''
                                      }`}
                                    >
                                      <span>{option.name}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </DisclosurePanel>
                  <DisclosureButton as={'div'}>
                    <button className={classes.burgerDropdownListItemTrigger}>
                      <Icon name={'chevron-down'} />
                    </button>
                  </DisclosureButton>
                </Disclosure>
              </li>
            );
          })}
        </ul>
      </Inner>
    </div>
  );
};

const Header: React.FC = () => {
  const [isBurgerDropdownOpen, setIsBurgerDropdownOpen] = React.useState<boolean>(false);
  const { isSearchOpen } = useSiteContext();
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { logoSlug } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();

  const siteLogoConfig = getSiteConfigSingleValue(logoSlug);
  const siteLogoSrc = siteLogoConfig || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
  const configSiteName = getSiteConfigSingleValue('siteName');

  const toggleBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen((prevState) => !prevState);
  }, []);

  const hideBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen(false);
  }, []);

  return (
    <React.Fragment>
      <header className={classes.header} ref={headerRef}>
        <Inner className={classes.headerTop} lowBottom lowTop>
          <ThemeTrigger />
          <LanguageTrigger />
        </Inner>

        <Inner className={classes.middle} lowTop>
          <HeaderMiddleLeft />

          <Link href={`/`} className={classes.middleLogo} aria-label={'Главная страница'}>
            <Image src={siteLogoSrc} width={166} height={27} alt={`${configSiteName}`} />
          </Link>

          <HeaderMiddleRight />
        </Inner>

        {isSearchOpen ? <HeaderSearch /> : null}
      </header>

      <StickyNav />

      <div className={classes.mobileNav}>
        <Inner className={classes.mobileNavInner}>
          <HeaderBurgerDropdownTrigger
            isBurgerDropdownOpen={isBurgerDropdownOpen}
            toggleBurgerDropdown={toggleBurgerDropdown}
          />

          <div className={classes.mobileNavRight}>
            <HeaderSearchTrigger />
            <HeaderProfileLink />
            <HeaderCartLink />
          </div>
        </Inner>
        <BurgerDropdown
          hideBurgerDropdown={hideBurgerDropdown}
          isBurgerDropdownOpen={isBurgerDropdownOpen}
        />
      </div>
    </React.Fragment>
  );
};

export default Header;
