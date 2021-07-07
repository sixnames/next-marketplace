import { Disclosure } from '@headlessui/react';
import { Menu, MenuButton, MenuPopover } from '@reach/menu-button';
import CounterSticker from 'components/CounterSticker/CounterSticker';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import LanguageTrigger from 'components/LanguageTrigger';
import Link from 'components/Link/Link';
import ThemeTrigger from 'components/ThemeTrigger';
import {
  ROLE_SLUG_COMPANY_MANAGER,
  ROLE_SLUG_COMPANY_OWNER,
  ROUTE_CONSOLE,
  ROUTE_CATALOGUE,
  ROUTE_PROFILE,
  ROUTE_SIGN_IN,
  ROUTE_DOCS_PAGES,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { useThemeContext } from 'context/themeContext';
import { useUserContext } from 'context/userContext';
import { CartInterface, CompanyInterface } from 'db/uiInterfaces';
import { useGetCatalogueSearchTopItemsQuery } from 'generated/apolloComponents';
import useSignOut from 'hooks/useSignOut';
import LayoutCard from 'layout/LayoutCard';
import CartDropdown from 'layout/SiteLayout/CartDropdown';
import { HeaderInterface } from 'layout/SiteLayout/Header';
import HeaderSearch from 'layout/SiteLayout/HeaderSearch';
import StickyNav from 'layout/SiteLayout/StickyNav';
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
                          href={`https://${process.env.DEFAULT_DOMAIN}${ROUTE_CONSOLE}`}
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
  cart: CartInterface;
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
    <div className='fixed inset-0 bg-secondary z-[1] w-full pt-4 pb-8 overflow-y-auto'>
      <Inner className='pb-24'>
        <div className='flex items-center justify-between mb-8'>
          <ThemeTrigger />
          <LanguageTrigger />
        </div>

        <ul className='pb-20'>
          {navRubrics.map((rubric) => {
            const { catalogue = [], card = [] } = query;
            const realCatalogueQuery = alwaysArray(catalogue);
            const catalogueSlug = realCatalogueQuery[0];
            const { name, slug, attributes } = rubric;

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
                  <Disclosure.Panel>
                    <div>
                      {(attributes || []).map(({ _id, options, name }) => {
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
                  </Disclosure.Panel>
                  <Disclosure.Button as={'div'}>
                    <button className='absolute top-0 right-0 z-[2] flex items-center justify-end w-[var(--minLinkHeight)] h-[var(--minLinkHeight)] flex-shrink-0 text-primary-text'>
                      <Icon name={'chevron-down'} className='w-5 h-5' />
                    </button>
                  </Disclosure.Button>
                </Disclosure>
              </li>
            );
          })}
        </ul>
      </Inner>
    </div>
  );
};

interface CompanyDefaultLayoutHeaderInterface extends HeaderInterface {
  company?: CompanyInterface | null;
}

const CompanyDefaultLayoutHeader: React.FC<CompanyDefaultLayoutHeaderInterface> = ({
  company,
  headerPageGroups,
}) => {
  const [isBurgerDropdownOpen, setIsBurgerDropdownOpen] = React.useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { logoSlug } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const { data } = useGetCatalogueSearchTopItemsQuery({
    ssr: false,
    variables: {
      input: {
        companyId: company ? company._id : null,
        companySlug: company ? company.slug : null,
      },
    },
  });

  const siteLogoConfig = getSiteConfigSingleValue(logoSlug);
  const siteLogoSrc = siteLogoConfig || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
  const configSiteName = getSiteConfigSingleValue('siteName');
  const callbackPhone = getSiteConfigSingleValue('phone');

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

            <div className='flex items-center gap-6'>
              {callbackPhone ? (
                <a className='text-secondary-text' href={`tel:${callbackPhone}`}>
                  {phoneToReadable(callbackPhone)}
                </a>
              ) : null}

              <ThemeTrigger />
              <LanguageTrigger />
            </div>
          </Inner>
        </div>

        <Inner lowTop lowBottom>
          <div className='flex justify-center py-7 lg:justify-between lg:py-4'>
            <div
              className={`hidden shrink-0 header-aside min-h-[1rem] lg:inline-flex justify-start`}
            >
              <div className={`${middleLinkClassName}`}>
                <div className={`relative mr-3`}>
                  <Icon name={'marker'} className='w-5 h-5' />
                </div>
                <span>Магазины</span>
              </div>
            </div>

            <Link
              href={`/`}
              className='flex items-center flex-shrink-0 w-[5rem]'
              aria-label={'Главная страница'}
            >
              <img
                className='w-full h-full object-contain'
                src={siteLogoSrc}
                width='100'
                alt={`${configSiteName}`}
              />
            </Link>

            <div className={`hidden shrink-0 header-aside min-h-[1rem] lg:inline-flex justify-end`}>
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

      <div className='block fixed z-[200] inset-x-0 bottom-0 lg:hidden'>
        <Inner
          className='relative z-[2] flex items-center justify-between h-[var(--mobileNavHeight)] bg-secondary'
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
