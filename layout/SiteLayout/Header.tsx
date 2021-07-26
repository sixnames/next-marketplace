import { Disclosure, Popover } from '@headlessui/react';
import ButtonCross from 'components/ButtonCross';
import LanguageTrigger from 'components/LanguageTrigger';
import ThemeTrigger from 'components/ThemeTrigger';
import { CompanyInterface, PagesGroupInterface } from 'db/uiInterfaces';
import useSignOut from 'hooks/useSignOut';
import LayoutCard from 'layout/LayoutCard';
import { noNaN } from 'lib/numbers';
import { phoneToReadable } from 'lib/phoneUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import StickyNav from 'layout/SiteLayout/StickyNav';
import Link from 'components/Link/Link';
import { useThemeContext } from 'context/themeContext';
import { useConfigContext } from 'context/configContext';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import { useSiteContext } from 'context/siteContext';
import HeaderSearch from 'layout/SiteLayout/HeaderSearch';
import { useUserContext } from 'context/userContext';
import CounterSticker from 'components/CounterSticker';
import CartDropdown from 'layout/SiteLayout/CartDropdown';
import { useGetCatalogueSearchTopItemsQuery } from 'generated/apolloComponents';
import {
  ROUTE_CONSOLE,
  ROUTE_CATALOGUE,
  ROUTE_CMS,
  ROUTE_PROFILE,
  ROUTE_SIGN_IN,
  ROUTE_DOCS_PAGES,
  CATALOGUE_OPTION_SEPARATOR,
  ROUTE_CONTACTS,
} from 'config/common';

const middleLinkClassName =
  'flex items-center justify-center min-h-[3rem] text-secondary-text cursor-pointer hover:text-theme transition-colors duration-200';

interface HeaderProfileLinkInterface {
  testId: string;
}

const HeaderProfileLink: React.FC<HeaderProfileLinkInterface> = ({ testId }) => {
  const signOut = useSignOut();
  const { me } = useUserContext();

  if (me) {
    return (
      <Popover className='relative flex items-center'>
        {() => {
          return (
            <React.Fragment>
              <Popover.Button
                className={`${middleLinkClassName} pr-2 pl-2`}
                data-cy={`${testId}-user-dropdown-trigger`}
                aria-label={'profile'}
              >
                <span className={`relative`}>
                  <Icon name={'user'} className='w-5 h-5' />
                </span>
              </Popover.Button>

              <Popover.Panel className='absolute z-10 top-full right-0'>
                <LayoutCard className='w-52 pb-4'>
                  <div className='pt-6 pb-6 pl-[var(--reachMenuItemHorizontalPadding)] pr-[var(--reachMenuItemHorizontalPadding)]'>
                    <div className='font-medium text-sm'>{me?.shortName}</div>
                  </div>

                  <ul className='divide-y divide-gray-300 dark:divide-gray-600'>
                    <li>
                      <Link
                        testId={`${testId}-user-dropdown-profile-link`}
                        className='flex items-center min-h-[3rem] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                        href={ROUTE_PROFILE}
                      >
                        <span>Личный кабинет</span>
                      </Link>
                    </li>

                    {me?.role?.isStaff && (me?.role?.cmsNavigation || []).length > 0 ? (
                      <li>
                        <Link
                          testId={`${testId}-user-dropdown-cms-link`}
                          className='flex items-center min-h-[3rem] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                          href={ROUTE_CMS}
                        >
                          <span>CMS</span>
                        </Link>
                      </li>
                    ) : null}

                    {me?.role?.isCompanyStaff && (me?.role?.appNavigation || []).length > 0 ? (
                      <li>
                        <Link
                          target={'_blank'}
                          testId={`${testId}-user-dropdown-app-link`}
                          className='flex items-center min-h-[3rem] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                          href={`${process.env.DEV_ENV ? 'http' : 'https'}://${
                            process.env.DEFAULT_DOMAIN
                          }${ROUTE_CONSOLE}`}
                        >
                          <span>Панель управления</span>
                        </Link>
                      </li>
                    ) : null}

                    <li onClick={signOut}>
                      <span
                        data-cy={`${testId}-sign-out-link`}
                        className='flex items-center min-h-[3rem] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme cursor-pointer no-underline'
                      >
                        Выйти из аккаунта
                      </span>
                    </li>
                  </ul>
                </LayoutCard>
              </Popover.Panel>
            </React.Fragment>
          );
        }}
      </Popover>
    );
  }

  return (
    <Link
      ariaLabel={'Войти'}
      testId={`${testId}-sign-in-link`}
      href={ROUTE_SIGN_IN}
      className={`${middleLinkClassName} pr-2 pl-2`}
    >
      <span className={`relative`}>
        <Icon name={'user'} className='w-5 h-5' />
      </span>
    </Link>
  );
};

interface HeaderCartLinkInterface {
  testId: string;
}

const HeaderCartLink: React.FC<HeaderCartLinkInterface> = ({ testId }) => {
  const { cart } = useSiteContext();

  if (cart && noNaN(cart.productsCount) > 0) {
    return (
      <Popover>
        <Popover.Button>
          <span
            data-cy={`${testId}-cart-dropdown-trigger`}
            className={`${middleLinkClassName} pl-2`}
          >
            <span className={`relative mr-3`}>
              <Icon name={'cart'} className='w-5 h-5' />
              <CounterSticker value={cart.productsCount} testId={'cart-counter'} />
            </span>
            <span className='hidden lg:block'>Корзина</span>
          </span>
        </Popover.Button>

        <Popover.Panel className='absolute z-10 top-[90%] right-[var(--innerBlockHorizontalPadding)]'>
          <CartDropdown cart={cart} />
        </Popover.Panel>
      </Popover>
    );
  }

  return (
    <span data-cy={`${testId}-cart-dropdown-trigger`} className={`${middleLinkClassName} pl-2`}>
      <span className={`relative mr-3`}>
        <Icon name={'cart'} className='w-5 h-5' />
      </span>
      <span className='hidden lg:block'>Корзина</span>
    </span>
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
  const { rubricSlug } = query;
  if (!isBurgerDropdownOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-primary z-[140] w-full pt-4 pb-8 overflow-y-auto'>
      <Inner className='pb-24'>
        <div className='flex items-center justify-between mb-8'>
          <ButtonCross onClick={hideBurgerDropdown} />
          <div className='flex items-center gap-5'>
            <ThemeTrigger />
            <LanguageTrigger />
          </div>
        </div>

        <ul className='headless-mobile-nav pb-20'>
          {navRubrics.map((rubric) => {
            const { name, attributes } = rubric;

            // Get rubric slug from product card path
            const isCurrent = rubric.slug === rubricSlug || rubricSlug === rubric.slug;

            return (
              <li className='relative' key={rubric.slug}>
                <Link
                  prefetch={false}
                  href={`${ROUTE_CATALOGUE}/${rubric.slug}`}
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
                      {(attributes || []).map((attribute) => {
                        return (
                          <div className='mt-4 mb-4' key={`${attribute._id}`}>
                            <div className='mb-2 text-secondary-text'>{attribute.name}</div>
                            <ul>
                              {(attribute.options || []).map((option) => {
                                const isCurrent = asPath === option.slug;
                                return (
                                  <li key={`${option._id}`}>
                                    <Link
                                      href={`${ROUTE_CATALOGUE}/${rubric.slug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
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

export interface HeaderInterface {
  headerPageGroups: PagesGroupInterface[];
  company?: CompanyInterface | null;
}

const middleSideClassName =
  'inline-flex shrink-0 lg:w-[calc((100%-(var(--logoWidth)+2rem))/2)] min-h-[1rem] gap-2';

const Header: React.FC<HeaderInterface> = ({ headerPageGroups, company }) => {
  const { isDark } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const [isBurgerDropdownOpen, setIsBurgerDropdownOpen] = React.useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { logoSlug } = useThemeContext();
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

  // styles
  const bgColorLightTheme = getSiteConfigSingleValue('siteTopBarBgLightTheme');
  const bgColorDarkTheme = getSiteConfigSingleValue('headerTopBarBgDarkTheme');
  const textColorLightTheme = getSiteConfigSingleValue('headerTopBarTextLightTheme');
  const textColorDarkTheme = getSiteConfigSingleValue('headerTopBarTextDarkTheme');
  const textColor =
    (isDark ? textColorDarkTheme : textColorLightTheme) || 'var(--textSecondaryColor)';

  const topBarBgStyle = {
    backgroundColor:
      (isDark ? bgColorDarkTheme : bgColorLightTheme) || 'var(--secondaryBackground)',
    color: textColor,
  } as React.CSSProperties;

  const topTextBgStyle = {
    color: textColor,
  } as React.CSSProperties;

  return (
    <React.Fragment>
      <header
        className='sticky lg:relative top-0 z-[130] bg-primary shadow-md lg:shadow-none'
        ref={headerRef}
      >
        {/*top bar*/}
        <div className='relative z-[10] bg-secondary' style={topBarBgStyle}>
          <Inner className='hidden h-[30px] items-center justify-between lg:flex' lowBottom lowTop>
            <div className='flex items-center'>
              {headerPageGroups.map(({ name, _id, pages }, index) => {
                console.log(index);
                return (
                  <div
                    key={`${_id}`}
                    className='header-sub-nav font-sm relative mr-6 cursor-pointer'
                  >
                    <div
                      className='flex items-center h-[30px] text-secondary-text'
                      style={topTextBgStyle}
                    >
                      {name}
                    </div>
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

                      {index === 0 ? (
                        <li className=''>
                          <Link
                            target={'_blank'}
                            className='block py-1.5 px-3 text-primary-text hover:no-underline hover:text-theme'
                            href={ROUTE_CONTACTS}
                          >
                            Контакты
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className='flex gap-6 items-center'>
              {callbackPhone ? (
                <a
                  className='text-secondary-text'
                  href={`tel:${callbackPhone}`}
                  style={topTextBgStyle}
                >
                  {phoneToReadable(callbackPhone)}
                </a>
              ) : null}

              <ThemeTrigger style={topTextBgStyle} />
              <LanguageTrigger style={topTextBgStyle} />
            </div>
          </Inner>
        </div>

        <Inner lowTop lowBottom className='relative'>
          <div className='flex justify-between py-6 lg:justify-between lg:py-4'>
            <div className={`${middleSideClassName} justify-start hidden lg:inline-flex`}>
              <div className={`${middleLinkClassName}`}>
                <div className={`relative mr-3`}>
                  <Icon name={'marker'} className='w-5 h-5' />
                </div>
                <span>Магазины</span>
              </div>
            </div>

            <Link
              href={`/`}
              className='flex items-center flex-shrink-0 w-[var(--logoWidth)] max-h-16 lg:max-h-24'
              aria-label={'Главная страница'}
            >
              <img
                className='w-full h-full object-contain object-left lg:object-center'
                src={siteLogoSrc}
                width='150'
                height='24'
                alt={`${configSiteName}`}
              />
            </Link>

            <div className={`${middleSideClassName} justify-end`}>
              {/*search trigger*/}
              <div
                data-cy={`header-search-trigger`}
                onClick={() => setIsSearchOpen(true)}
                className={`${middleLinkClassName} pr-2 pl-2`}
              >
                <div className={`relative`}>
                  <Icon name={'search'} className='w-5 h-5' />
                </div>
              </div>

              <HeaderProfileLink testId={'header'} />

              <div className={`${middleLinkClassName} hidden lg:flex pr-2 pl-2`}>
                <div className={`relative`}>
                  <Icon name={'compare'} className='w-5 h-5' />
                </div>
              </div>

              <div className={`${middleLinkClassName} hidden lg:flex pr-2 pl-2`}>
                <div className={`relative`}>
                  <Icon name={'heart'} className='w-5 h-5' />
                </div>
              </div>

              <HeaderCartLink testId={'header'} />

              {/*Burger trigger*/}
              <div
                data-cy={`burger-trigger`}
                onClick={toggleBurgerDropdown}
                className={`${middleLinkClassName} lg:hidden`}
              >
                <div className={`relative`}>
                  <Icon name={'burger'} className={'w-6 h-6'} />
                </div>
              </div>
            </div>
          </div>
        </Inner>

        {isSearchOpen ? (
          <HeaderSearch setIsSearchOpen={setIsSearchOpen} initialData={data} />
        ) : null}
      </header>

      <StickyNav />

      <BurgerDropdown
        hideBurgerDropdown={hideBurgerDropdown}
        isBurgerDropdownOpen={isBurgerDropdownOpen}
      />
    </React.Fragment>
  );
};

export default Header;
