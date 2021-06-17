import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import LanguageTrigger from 'components/LanguageTrigger/LanguageTrigger';
import ThemeTrigger from 'components/ThemeTrigger/ThemeTrigger';
import { CartInterface, PagesGroupInterface } from 'db/uiInterfaces';
import useSignOut from 'hooks/useSignOut';
import LayoutCard from 'layout/LayoutCard';
import { alwaysArray } from 'lib/arrayUtils';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import StickyNav from 'layout/SiteLayout/StickyNav';
import Link from 'components/Link/Link';
import { useThemeContext } from 'context/themeContext';
import { useConfigContext } from 'context/configContext';
import Icon from 'components/Icon/Icon';
import Inner from 'components/Inner/Inner';
import { useSiteContext } from 'context/siteContext';
import HeaderSearch from 'layout/SiteLayout/HeaderSearch';
import { useUserContext } from 'context/userContext';
import CounterSticker from 'components/CounterSticker/CounterSticker';
import { Menu, MenuButton, MenuPopover } from '@reach/menu-button';
import CartDropdown from 'layout/SiteLayout/CartDropdown';
import { useGetCatalogueSearchTopItemsQuery } from 'generated/apolloComponents';
import {
  ROUTE_CONSOLE,
  ROUTE_CATALOGUE,
  ROUTE_CMS,
  ROUTE_PROFILE,
  ROUTE_SIGN_IN,
  ROUTE_DOCS_PAGES,
} from 'config/common';

interface HeaderSearchTriggerInterface {
  setIsSearchOpen: (value: boolean) => void;
  testId: string;
}

const middleLinkClassName =
  'flex items-center justify-center min-h-[3rem] text-secondary-text cursor-pointer hover:text-theme transition-colors duration-200';

const HeaderSearchTrigger: React.FC<HeaderSearchTriggerInterface> = ({
  setIsSearchOpen,
  testId,
}) => {
  return (
    <div
      data-cy={`${testId}-search-trigger`}
      onClick={() => setIsSearchOpen(true)}
      className={`${middleLinkClassName} ml-2 mr-2 pr-2 pl-2`}
    >
      <div className={`relative`}>
        <Icon name={'search'} className='w-5 h-5' />
      </div>
    </div>
  );
};

interface HeaderProfileLinkInterface {
  testId: string;
}

const HeaderProfileLink: React.FC<HeaderProfileLinkInterface> = ({ testId }) => {
  const signOut = useSignOut();
  const { me } = useUserContext();

  if (me) {
    return (
      <Menu>
        {() => {
          return (
            <React.Fragment>
              <MenuButton
                className={`${middleLinkClassName} ml-2 mr-2 pr-2 pl-2`}
                data-cy={`${testId}-user-dropdown-trigger`}
              >
                <span className={`relative`}>
                  <Icon name={'user'} className='w-5 h-5' />
                </span>
              </MenuButton>
              <MenuPopover>
                <LayoutCard>
                  <div className='pt-6 pb-6 pl-[var(--reachMenuItemHorizontalPadding)] pr-[var(--reachMenuItemHorizontalPadding)]'>
                    <div className='font-medium text-sm'>{me?.shortName}</div>
                  </div>

                  <ul className='divide-y divide-gray-300 dark:divide-gray-600'>
                    <li>
                      <Link
                        testId={`${testId}-user-dropdown-profile-link`}
                        className='flex items-center min-h-[var(--reachMenuItemMinimalHeight)] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                        href={ROUTE_PROFILE}
                      >
                        <span>Личный кабинет</span>
                      </Link>
                    </li>

                    {me?.role?.isStaff && (me?.role?.cmsNavigation || []).length > 0 ? (
                      <li>
                        <Link
                          testId={`${testId}-user-dropdown-cms-link`}
                          className='flex items-center min-h-[var(--reachMenuItemMinimalHeight)] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                          href={ROUTE_CMS}
                        >
                          <span>CMS</span>
                        </Link>
                      </li>
                    ) : null}

                    {me?.role?.isCompanyStaff && (me?.role?.appNavigation || []).length > 0 ? (
                      <li>
                        <Link
                          testId={`${testId}-user-dropdown-app-link`}
                          className='flex items-center min-h-[var(--reachMenuItemMinimalHeight)] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                          href={ROUTE_CONSOLE}
                        >
                          <span>Панель управления</span>
                        </Link>
                      </li>
                    ) : null}

                    <li onClick={signOut}>
                      <span
                        data-cy={`${testId}-sign-out-link`}
                        className='flex items-center min-h-[var(--reachMenuItemMinimalHeight)] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme cursor-pointer no-underline'
                      >
                        Выйти из аккаунта
                      </span>
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
      testId={`${testId}-sign-in-link`}
      href={ROUTE_SIGN_IN}
      className={`${middleLinkClassName} ml-2 mr-2 pr-2 pl-2`}
    >
      <span className={`relative`}>
        <Icon name={'user'} className='w-5 h-5' />
      </span>
    </Link>
  );
};

interface HeaderCartDropdownButtonInterface {
  cart: CartInterface;
  testId: string;
}

const HeaderCartDropdownButton: React.FC<HeaderCartDropdownButtonInterface> = ({
  cart,
  testId,
}) => {
  return (
    <React.Fragment>
      <MenuButton>
        <span
          data-cy={`${testId}-cart-dropdown-trigger`}
          className={`${middleLinkClassName} ml-2 pl-2`}
        >
          <span className={`relative mr-3`}>
            <Icon name={'cart'} className='w-5 h-5' />
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

interface HeaderCartLinkInterface {
  testId: string;
}

const HeaderCartLink: React.FC<HeaderCartLinkInterface> = ({ testId }) => {
  const { cart } = useSiteContext();

  if (cart && noNaN(cart.productsCount) > 0) {
    return (
      <Menu>
        {() => {
          return <HeaderCartDropdownButton testId={testId} cart={cart} />;
        }}
      </Menu>
    );
  }

  return (
    <span
      data-cy={`${testId}-cart-dropdown-trigger`}
      className={`${middleLinkClassName} ml-2 pl-2`}
    >
      <span className={`relative mr-3`}>
        <Icon name={'cart'} className='w-5 h-5' />
      </span>
      <span>Корзина</span>
    </span>
  );
};

interface HeaderBurgerDropdownTriggerInterface {
  toggleBurgerDropdown: () => void;
}

const HeaderBurgerDropdownTrigger: React.FC<HeaderBurgerDropdownTriggerInterface> = ({
  toggleBurgerDropdown,
}) => {
  return (
    <div
      data-cy={`burger-trigger`}
      onClick={toggleBurgerDropdown}
      className={`${middleLinkClassName}`}
    >
      <div className={`relative mr-3`}>
        <Icon name={'burger'} className={'w-5 h-5'} />
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
    <div className='fixed inset-0 bg-secondary z-[1] w-full pt-4 pb-8 overflow-y-auto'>
      <Inner className='pb-24'>
        <div className='flex items-center justify-between mb-8'>
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
              <li className='relative' key={rubric.slug}>
                <Link
                  prefetch={false}
                  href={`${ROUTE_CATALOGUE}/${slug}`}
                  onClick={hideBurgerDropdown}
                  testId={`main-rubric-${rubric.name}`}
                  className={`flex items-center justify-between min-h-[var(--minLinkHeight)] text-xl font-medium flex-grow ${
                    isCurrent ? 'text-theme' : 'text-primary-text'
                  }`}
                >
                  {name}
                </Link>
                <Disclosure>
                  <DisclosurePanel>
                    <div>
                      {(navItems || []).map(({ _id, options, name }) => {
                        return (
                          <div className='mt-4 mb-4' key={`${_id}`}>
                            <div className='mb-2 text-secondary-text'>{name}</div>
                            <ul>
                              {(options || []).map((option) => {
                                const isCurrent = asPath === option.slug;
                                return (
                                  <li key={`${option._id}`}>
                                    <Link
                                      href={`${ROUTE_CATALOGUE}/${rubric.slug}/${option.slug}`}
                                      onClick={hideBurgerDropdown}
                                      className={`flex items-center h-10 ${
                                        isCurrent ? 'text-theme' : 'text-primary-text'
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
                    <button className='absolute top-0 right-0 z-[2] flex items-center justify-end w-[var(--minLinkHeight)] h-[var(--minLinkHeight)] flex-shrink-0 text-primary-text'>
                      <Icon name={'chevron-down'} className='w-5 h-5' />
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

interface HeaderInterface {
  headerPageGroups: PagesGroupInterface[];
}

const middleSideClassName = 'hidden shrink-0 header-aside min-h-[1rem] lg:inline-flex';
const Header: React.FC<HeaderInterface> = ({ headerPageGroups }) => {
  const [isBurgerDropdownOpen, setIsBurgerDropdownOpen] = React.useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { logoSlug } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const { data } = useGetCatalogueSearchTopItemsQuery({
    ssr: false,
    variables: {
      input: {},
    },
  });

  const siteLogoConfig = getSiteConfigSingleValue(logoSlug);
  const siteLogoSrc = siteLogoConfig || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
  const configSiteName = getSiteConfigSingleValue('siteName');

  const toggleBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen((prevState) => !prevState);
  }, []);

  const hideBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen(false);
  }, []);

  const headerVars = { '--logo-width': '10rem' } as React.CSSProperties;

  return (
    <React.Fragment>
      <header
        className='relative z-[130] bg-primary shadow-md lg:shadow-none'
        style={headerVars}
        ref={headerRef}
      >
        <div className='relative z-[10] bg-secondary'>
          <Inner className='hidden h-[30px] items-center justify-between lg:flex' lowBottom lowTop>
            <div className='flex items-center'>
              {headerPageGroups.map(({ name, _id, pages }) => {
                return (
                  <div
                    key={`${_id}`}
                    className='header-sub-nav font-sm relative mr-6 cursor-pointer'
                  >
                    <div className='flex items-center h-[30px] text-secondary-text'>{name}</div>
                    <ul className='header-sub-nav-list rounded-md bg-secondary shadow-md'>
                      {(pages || []).map(({ name, slug, _id }) => {
                        return (
                          <li className='' key={`${_id}`}>
                            <Link
                              target={'_blank'}
                              className='block py-1.5 px-3 text-primary-text hover:no-underline hover:text-theme'
                              href={`${ROUTE_DOCS_PAGES}/${slug}`}
                            >
                              {name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className='flex items-center'>
              <ThemeTrigger />
              <div className='ml-6'>
                <LanguageTrigger />
              </div>
            </div>
          </Inner>
        </div>

        <Inner lowTop lowBottom>
          <div className='flex justify-center pt-7 pb-7 lg:justify-between lg:py-4'>
            <div className={`${middleSideClassName} justify-start`}>
              <div className={`${middleLinkClassName}`}>
                <div className={`relative mr-3`}>
                  <Icon name={'marker'} className='w-5 h-5' />
                </div>
                <span>Винотеки</span>
              </div>
            </div>

            <Link
              href={`/`}
              className='flex items-center flex-shrink-0 w-[var(--logo-width)]'
              aria-label={'Главная страница'}
            >
              <img
                className='w-full h-auto'
                src={siteLogoSrc}
                width='150'
                height='24'
                alt={`${configSiteName}`}
              />
            </Link>

            <div className={`${middleSideClassName} justify-end`}>
              <HeaderSearchTrigger testId={'header'} setIsSearchOpen={setIsSearchOpen} />
              <HeaderProfileLink testId={'header'} />

              <div className={`${middleLinkClassName} ml-2 mr-2 pr-2 pl-2`}>
                <div className={`relative`}>
                  <Icon name={'compare'} className='w-5 h-5' />
                </div>
              </div>

              <div className={`${middleLinkClassName} ml-2 mr-2 pr-2 pl-2`}>
                <div className={`relative`}>
                  <Icon name={'heart'} className='w-5 h-5' />
                </div>
              </div>

              <HeaderCartLink testId={'header'} />
            </div>
          </div>
        </Inner>

        {isSearchOpen ? (
          <HeaderSearch setIsSearchOpen={setIsSearchOpen} initialData={data} />
        ) : null}
      </header>

      <StickyNav />

      <div className='block fixed z-[200] inset-x-0 bottom-0 wp-shadow-top-100 lg:hidden'>
        <Inner
          className='relative z-[2] flex items-center justify-between h-[var(--mobileNavHeight)] bg-secondary'
          lowTop
        >
          <HeaderBurgerDropdownTrigger toggleBurgerDropdown={toggleBurgerDropdown} />

          <div className='flex items-center'>
            <HeaderSearchTrigger testId={'mobile-nav'} setIsSearchOpen={setIsSearchOpen} />
            <HeaderProfileLink testId={'mobile-nav'} />
            <HeaderCartLink testId={'mobile-nav'} />
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
