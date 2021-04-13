import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import { Menu, MenuButton, MenuPopover } from '@reach/menu-button';
import CounterSticker from 'components/CounterSticker/CounterSticker';
import Icon from 'components/Icon/Icon';
import Inner from 'components/Inner/Inner';
import LanguageTrigger from 'components/LanguageTrigger/LanguageTrigger';
import Link from 'components/Link/Link';
import ThemeTrigger from 'components/ThemeTrigger/ThemeTrigger';
import {
  ROLE_SLUG_COMPANY_MANAGER,
  ROLE_SLUG_COMPANY_OWNER,
  ROUTE_APP,
  ROUTE_CATALOGUE,
  ROUTE_PROFILE,
  ROUTE_SIGN_IN,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { useThemeContext } from 'context/themeContext';
import { useUserContext } from 'context/userContext';
import { CartModel, CompanyModel } from 'db/dbModels';
import { useGetCatalogueSearchTopItemsQuery } from 'generated/apolloComponents';
import useSignOut from 'hooks/useSignOut';
import LayoutCard from 'layout/LayoutCard/LayoutCard';
import CartDropdown from 'layout/SiteLayout/Header/CartDropdown';
import HeaderSearch from 'layout/SiteLayout/Header/HeaderSearch';
import StickyNav from 'layout/SiteLayout/Header/StickyNav';
import { alwaysArray } from 'lib/arrayUtils';
import { noNaN } from 'lib/numbers';
import { phoneToReadable } from 'lib/phoneUtils';
import { useRouter } from 'next/router';
import * as React from 'react';

interface HeaderSearchTriggerInterface {
  setIsSearchOpen: (value: boolean) => void;
}

const middleLinkClassName =
  'flex items-center justify-center min-h-[3rem] text-secondary-text cursor-pointer hover:text-theme transition-colors duration-200';

const HeaderSearchTrigger: React.FC<HeaderSearchTriggerInterface> = ({ setIsSearchOpen }) => {
  return (
    <div
      data-cy={'search-trigger'}
      onClick={() => setIsSearchOpen(true)}
      className={`${middleLinkClassName} ml-2 mr-2 pr-2 pl-2`}
    >
      <div className={`relative`}>
        <Icon name={'search'} className='w-5 h-5' />
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
              <MenuButton
                className={`${middleLinkClassName} ml-2 mr-2 pr-2 pl-2`}
                data-cy={'user-dropdown-trigger'}
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
                        className='flex items-center min-h-[var(--reachMenuItemMinimalHeight)] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                        href={ROUTE_PROFILE}
                      >
                        <span>Личный кабинет</span>
                      </Link>
                    </li>

                    {me?.role?.slug === ROLE_SLUG_COMPANY_MANAGER ||
                    me?.role?.slug === ROLE_SLUG_COMPANY_OWNER ? (
                      <li>
                        <a
                          target={'_blank'}
                          className='flex items-center min-h-[var(--reachMenuItemMinimalHeight)] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                          href={`https://${process.env.DEFAULT_DOMAIN}${ROUTE_APP}`}
                          rel='noreferrer'
                        >
                          <span>Панель управления</span>
                        </a>
                      </li>
                    ) : null}

                    <li onClick={signOut}>
                      <span className='flex items-center min-h-[var(--reachMenuItemMinimalHeight)] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme cursor-pointer no-underline'>
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
      testId={me ? `profile-link` : `sign-in-link`}
      href={me ? ROUTE_PROFILE : ROUTE_SIGN_IN}
      className={`${middleLinkClassName} ml-2 mr-2 pr-2 pl-2`}
    >
      <span className={`relative`}>
        <Icon name={'user'} className='w-5 h-5' />
      </span>
    </Link>
  );
};

interface HeaderCartDropdownButtonInterface {
  cart: CartModel;
}

const HeaderCartDropdownButton: React.FC<HeaderCartDropdownButtonInterface> = ({ cart }) => {
  return (
    <React.Fragment>
      <MenuButton>
        <span data-cy={'cart-dropdown-trigger'} className={`${middleLinkClassName} ml-2 pl-2`}>
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

const HeaderCartLink: React.FC = () => {
  const { cart } = useSiteContext();

  if (cart && noNaN(cart.productsCount) > 0) {
    return (
      <Menu>
        {() => {
          return <HeaderCartDropdownButton cart={cart} />;
        }}
      </Menu>
    );
  }

  return (
    <span data-cy={'cart-dropdown-trigger'} className={`${middleLinkClassName} ml-2 pl-2`}>
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
    <div className='fixed inset-0 bg-secondary-background z-[1] w-full pt-4 pb-8 overflow-y-auto'>
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
                              {options.map((option) => {
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

interface CompanyDefaultLayoutHeaderInterface {
  company?: CompanyModel | null;
}

const CompanyDefaultLayoutHeader: React.FC<CompanyDefaultLayoutHeaderInterface> = ({ company }) => {
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
  const callbackPhone = company?.contacts.phones[0];

  const toggleBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen((prevState) => !prevState);
  }, []);

  const hideBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen(false);
  }, []);

  const headerVars = { '--logo-width': '7rem' } as React.CSSProperties;

  return (
    <React.Fragment>
      <header
        className='relative z-[130] bg-primary-background shadow-md wp-desktop:shadow-none'
        style={headerVars}
        ref={headerRef}
      >
        <Inner
          className='hidden relative z-[10] h-[30px] items-center justify-between wp-desktop:flex'
          lowBottom
          lowTop
        >
          <ThemeTrigger />
          <div className='flex items-center'>
            <a className='text-secondary-text' href={`tel:${callbackPhone}`}>
              {phoneToReadable(callbackPhone)}
            </a>
            <div className='ml-4'>
              <LanguageTrigger />
            </div>
          </div>
        </Inner>

        <Inner lowTop lowBottom>
          <div className='flex justify-center pt-7 pb-7 wp-desktop:justify-between wp-desktop:pt-2 wp-desktop:pt-4'>
            <div
              className={`hidden shrink-0 header-aside min-h-[1rem] wp-desktop:inline-flex justify-start`}
            >
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
                className='w-full h-full object-contain'
                src={siteLogoSrc}
                width='150'
                height='24'
                alt={`${configSiteName}`}
              />
            </Link>

            <div
              className={`hidden shrink-0 header-aside min-h-[1rem] wp-desktop:inline-flex justify-end`}
            >
              <HeaderSearchTrigger setIsSearchOpen={setIsSearchOpen} />
              <HeaderProfileLink />

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

              <HeaderCartLink />
            </div>
          </div>
        </Inner>

        {isSearchOpen ? (
          <HeaderSearch setIsSearchOpen={setIsSearchOpen} initialData={data} />
        ) : null}
      </header>

      <StickyNav />

      <div className='block fixed z-[200] inset-x-0 bottom-0 wp-desktop:hidden'>
        <Inner
          className='relative z-[2] flex items-center justify-between h-[var(--mobileNavHeight)] bg-secondary-background'
          lowTop
        >
          <HeaderBurgerDropdownTrigger toggleBurgerDropdown={toggleBurgerDropdown} />

          <div className='flex items-center'>
            <HeaderSearchTrigger setIsSearchOpen={setIsSearchOpen} />
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

export default CompanyDefaultLayoutHeader;
