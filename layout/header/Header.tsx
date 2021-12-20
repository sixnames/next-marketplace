import { Disclosure, Popover } from '@headlessui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { get } from 'lodash';
import ButtonCross from '../../components/button/ButtonCross';
import CityTrigger from '../../components/CityTrigger';
import CounterSticker from '../../components/CounterSticker';
import Inner from '../../components/Inner';
import LanguageTrigger from '../../components/LanguageTrigger';
import LinkPhone from '../../components/Link/LinkPhone';
import WpLink from '../../components/Link/WpLink';
import { MapModalInterface } from '../../components/Modal/MapModal';
import ThemeTrigger from '../../components/ThemeTrigger';
import WpIcon from '../../components/WpIcon';
import {
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
  IMAGE_FALLBACK,
  ROUTE_BLOG_WITH_PAGE,
  ROUTE_CATALOGUE,
  ROUTE_CMS,
  ROUTE_CONSOLE,
  ROUTE_CONTACTS,
  ROUTE_DOCS_PAGES,
  ROUTE_PROFILE,
  ROUTE_SIGN_IN,
} from '../../config/common';
import { getConstantTranslation } from '../../config/constantTranslations';
import { MAP_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useConfigContext } from '../../context/configContext';
import { useLocaleContext } from '../../context/localeContext';
import { useSiteContext } from '../../context/siteContext';
import { useSiteUserContext } from '../../context/siteUserContext';
import { useThemeContext } from '../../context/themeContext';
import { PagesGroupInterface } from '../../db/uiInterfaces';
import { useShopMarker } from '../../hooks/useShopMarker';
import useSignOut from '../../hooks/useSignOut';
import { noNaN } from '../../lib/numbers';
import { phoneToRaw, phoneToReadable } from '../../lib/phoneUtils';
import LayoutCard from '../LayoutCard';
import CartDropdown from './CartDropdown';
import HeaderSearch from './HeaderSearch';
import StickyNav, { StickNavInterface } from './StickyNav';

const middleLinkClassName =
  'flex items-center justify-center min-h-[3rem] text-secondary-text cursor-pointer hover:text-theme transition-colors duration-200';

interface HeaderProfileLinkInterface {
  testId: string;
}

const HeaderProfileLink: React.FC<HeaderProfileLinkInterface> = ({ testId }) => {
  const { urlPrefix } = useSiteContext();
  const signOut = useSignOut();
  const sessionUser = useSiteUserContext();

  if (sessionUser) {
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
                  <WpIcon name={'user'} className='w-5 h-5' />
                </span>
              </Popover.Button>

              <Popover.Panel className='absolute z-10 top-full right-0'>
                <LayoutCard className='w-52 pb-4'>
                  <div className='pt-6 pb-6 pl-[var(--reachMenuItemHorizontalPadding)] pr-[var(--reachMenuItemHorizontalPadding)]'>
                    <div className='font-medium text-sm'>{sessionUser.me.shortName}</div>
                  </div>

                  <ul className='divide-y divide-gray-300 dark:divide-gray-600'>
                    <li>
                      <WpLink
                        testId={`${testId}-user-dropdown-profile-link`}
                        className='flex items-center min-h-[3rem] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                        href={`${urlPrefix}${ROUTE_PROFILE}`}
                      >
                        <span>Личный кабинет</span>
                      </WpLink>
                    </li>

                    {sessionUser.me.role?.isStaff &&
                    (sessionUser.me.role?.cmsNavigation || []).length > 0 ? (
                      <li>
                        <WpLink
                          testId={`${testId}-user-dropdown-cms-link`}
                          className='flex items-center min-h-[3rem] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                          href={ROUTE_CMS}
                        >
                          <span>CMS</span>
                        </WpLink>
                      </li>
                    ) : null}

                    {sessionUser.me.role?.isCompanyStaff &&
                    (sessionUser.me.role?.appNavigation || []).length > 0 ? (
                      <li>
                        <WpLink
                          testId={`${testId}-user-dropdown-app-link`}
                          className='flex items-center min-h-[3rem] py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text hover:text-theme hover:no-underline cursor-pointer no-underline'
                          href={ROUTE_CONSOLE}
                        >
                          <span>Панель управления</span>
                        </WpLink>
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
    <WpLink
      ariaLabel={'Войти'}
      testId={`${testId}-sign-in-link`}
      href={`${urlPrefix}${ROUTE_SIGN_IN}`}
      className={`${middleLinkClassName} pr-2 pl-2`}
    >
      <span className={`relative`}>
        <WpIcon name={'user'} className='w-5 h-5' />
      </span>
    </WpLink>
  );
};

interface HeaderCartLinkInterface {
  testId: string;
}

const HeaderCartLink: React.FC<HeaderCartLinkInterface> = ({ testId }) => {
  const { cart } = useSiteContext();

  if (cart && noNaN(cart.productsCount) > 0) {
    return (
      <Popover as={'div'} className='flex items-center'>
        <Popover.Button>
          <span
            data-cy={`${testId}-cart-dropdown-trigger`}
            className={`${middleLinkClassName} pl-2`}
          >
            <span className={`relative mr-3`}>
              <WpIcon name={'cart'} className='w-5 h-5' />
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
        <WpIcon name={'cart'} className='w-5 h-5' />
      </span>
      <span className='hidden lg:block'>Корзина</span>
    </span>
  );
};

interface BurgerDropdownInterface {
  isBurgerDropdownOpen: boolean;
  hideBurgerDropdown: () => void;
  headerPageGroups: PagesGroupInterface[];
}

const BurgerDropdown: React.FC<BurgerDropdownInterface> = ({
  isBurgerDropdownOpen,
  hideBurgerDropdown,
  headerPageGroups,
}) => {
  const { showModal } = useAppContext();
  const { locale } = useLocaleContext();
  const { configs, domainCompany } = useConfigContext();
  const router = useRouter();
  const { navRubrics, urlPrefix } = useSiteContext();
  const { query, asPath } = router;
  const { rubricSlug } = query;
  const marker = useShopMarker(domainCompany?.mainShop);
  if (!isBurgerDropdownOpen) {
    return null;
  }

  const showBlog = configs.showBlog;
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);
  const contactsLinkName = getConstantTranslation(`nav.contacts.${locale}`);
  const callbackPhone = configs.phone[0];
  const visibleOptionsCount = configs.stickyNavVisibleOptionsCount;

  return (
    <div className='fixed inset-0 bg-primary z-[140] w-full pt-4 pb-8 overflow-y-auto min-w-[320px]'>
      <Inner className='pb-24'>
        <div className='flex items-center justify-between mb-8'>
          <ButtonCross onClick={hideBurgerDropdown} />
          <div className='flex items-center gap-5'>
            <ThemeTrigger />
            <LanguageTrigger />
            <CityTrigger />
          </div>
        </div>

        <ul className='headless-mobile-nav pb-10'>
          {navRubrics.map((rubric) => {
            const { name, attributes, variant, categories } = rubric;

            // Get rubric slug from product card path
            const isCurrent = rubric.slug === rubricSlug;

            return (
              <li className='relative' key={rubric.slug}>
                <WpLink
                  prefetch={false}
                  href={`${urlPrefix}${ROUTE_CATALOGUE}/${rubric.slug}`}
                  onClick={hideBurgerDropdown}
                  testId={`main-rubric-${rubric.name}`}
                  className={`flex items-center justify-between min-h-[var(--minLinkHeight)] text-xl font-medium flex-grow ${
                    isCurrent ? 'text-theme' : 'text-primary-text'
                  }`}
                >
                  {name}
                </WpLink>
                <Disclosure>
                  <Disclosure.Panel>
                    <div>
                      {variant?.showCategoriesInNav && (categories || []).length > 0 ? (
                        <div className='mt-2 mb-10'>
                          <div className='mb-2 text-xl font-medium text-secondary-text'>
                            Категории
                          </div>
                          <ul>
                            {(categories || []).map((category) => {
                              const isCurrent = asPath === category.slug;
                              return (
                                <li key={`${category._id}`}>
                                  <WpLink
                                    href={`${urlPrefix}${ROUTE_CATALOGUE}/${rubric.slug}/${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`}
                                    onClick={hideBurgerDropdown}
                                    className={`flex items-center h-10 ${
                                      isCurrent ? 'text-theme' : 'text-primary-text'
                                    }`}
                                  >
                                    <span>{category.name}</span>
                                  </WpLink>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}

                      {(attributes || []).map((attribute) => {
                        const showOptionsMoreLink =
                          noNaN(visibleOptionsCount) === attribute.options?.length;
                        return (
                          <div className='mt-2 mb-10' key={`${attribute._id}`}>
                            <div className='mb-2 text-xl font-medium text-secondary-text'>
                              {attribute.name}
                            </div>
                            <ul>
                              {(attribute.options || []).map((option) => {
                                const isCurrent = asPath === option.slug;
                                return (
                                  <li key={`${option._id}`}>
                                    <WpLink
                                      href={`${urlPrefix}${ROUTE_CATALOGUE}/${rubric.slug}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                                      onClick={hideBurgerDropdown}
                                      className={`flex items-center h-10 ${
                                        isCurrent ? 'text-theme' : 'text-primary-text'
                                      }`}
                                    >
                                      <span>{option.name}</span>
                                    </WpLink>
                                  </li>
                                );
                              })}

                              {showOptionsMoreLink ? (
                                <li>
                                  <div
                                    className='flex items-center h-10 text-theme font-medium cursor-pointer'
                                    onClick={() => {
                                      router
                                        .push(`${urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}`)
                                        .then(hideBurgerDropdown)
                                        .catch(console.log);
                                    }}
                                  >
                                    Показать все
                                  </div>
                                </li>
                              ) : null}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </Disclosure.Panel>
                  <Disclosure.Button as={'div'}>
                    <button className='absolute top-0 right-0 z-[2] flex items-center justify-end w-[var(--minLinkHeight)] h-[var(--minLinkHeight)] flex-shrink-0 text-primary-text outline-none focus:outline-none'>
                      <WpIcon name={'chevron-down'} className='w-5 h-5' />
                    </button>
                  </Disclosure.Button>
                </Disclosure>
              </li>
            );
          })}
        </ul>

        <div className='pb-4'>
          {headerPageGroups.map(({ name, _id, pages }, index) => {
            return (
              <div className='relative mb-8' key={`${_id}`}>
                <div
                  className={`flex items-center justify-between text-lg mb-3 font-medium flex-grow`}
                >
                  {name}
                </div>

                <ul>
                  {(pages || []).map((page) => {
                    return (
                      <li className='' key={`${page._id}`}>
                        <WpLink
                          href={`${urlPrefix}${ROUTE_DOCS_PAGES}/${page.slug}`}
                          onClick={hideBurgerDropdown}
                          className={`flex items-center h-10 text-secondary-text`}
                        >
                          <span>{page.name}</span>
                        </WpLink>
                      </li>
                    );
                  })}

                  {index === 0 ? (
                    <li className=''>
                      <div className=''>
                        <WpLink
                          href={`${urlPrefix}${ROUTE_CONTACTS}`}
                          onClick={hideBurgerDropdown}
                          className={`flex items-center h-10 text-secondary-text`}
                        >
                          <span>{contactsLinkName}</span>
                        </WpLink>
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>
            );
          })}

          {showBlog ? (
            <div className='relative mb-8'>
              <div
                className={`flex items-center justify-between text-lg mb-3 font-medium flex-grow text-primary-text`}
                onClick={() => {
                  hideBurgerDropdown();
                  window.open(`${urlPrefix}${ROUTE_BLOG_WITH_PAGE}`, '_blank');
                }}
              >
                {blogLinkName}
              </div>
            </div>
          ) : null}
        </div>

        {configs.isOneShopCompany && domainCompany && domainCompany.mainShop ? (
          <div className='flex items-center'>
            <div>
              <div
                className='flex items-center gap-3 cursor-pointer hover:text-theme transition-all'
                onClick={() => {
                  hideBurgerDropdown();
                  showModal<MapModalInterface>({
                    variant: MAP_MODAL,
                    props: {
                      title: `${domainCompany.mainShop?.name}`,
                      testId: `shop-map-modal`,
                      markers: [
                        {
                          _id: domainCompany.mainShop?._id,
                          icon: marker,
                          name: `${domainCompany.mainShop?.name}`,
                          address: domainCompany.mainShop?.address,
                        },
                      ],
                    },
                  });
                }}
              >
                <div className='text-theme'>
                  <WpIcon name={'marker'} className='w-5 h-5' />
                </div>
                <div>{domainCompany.mainShop.address.readableAddress}</div>
              </div>

              <div className='flex items-center gap-3 mt-4'>
                <div className='text-theme'>
                  <WpIcon name={'phone'} className='w-5 h-5' />
                </div>
                <div>
                  <LinkPhone
                    className='text-primary-text hover:text-theme transition-all'
                    value={{
                      raw: phoneToRaw(callbackPhone),
                      readable: phoneToReadable(callbackPhone),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Inner>
    </div>
  );
};

export interface HeaderInterface extends StickNavInterface {
  headerPageGroups: PagesGroupInterface[];
}

const middleSideClassName =
  'inline-flex shrink-0 lg:w-[calc((100%-(var(--logoWidth)+2rem))/2)] min-h-[1rem] gap-2';

const Header: React.FC<HeaderInterface> = ({ headerPageGroups, currentRubricSlug }) => {
  const { isDark } = useThemeContext();
  const { showModal } = useAppContext();
  const { configs, domainCompany } = useConfigContext();
  const { locale } = useLocaleContext();
  const { logoSlug } = useThemeContext();
  const { urlPrefix } = useSiteContext();
  const [isBurgerDropdownOpen, setIsBurgerDropdownOpen] = React.useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const marker = useShopMarker(domainCompany?.mainShop);

  const siteLogoSrc = get(configs, logoSlug) || IMAGE_FALLBACK;
  const configLogoWidth = configs.siteLogoWidth || '10rem';
  const configLogoMobileWidth = configs.siteMobileLogoWidth || '7rem';
  const configSiteName = configs.siteName;
  const callbackPhone = configs.phone[0];

  const toggleBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen((prevState) => !prevState);
  }, []);

  const hideBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen(false);
  }, []);

  // styles
  const bgColorLightTheme = configs.siteTopBarBgLightTheme;
  const bgColorDarkTheme = configs.headerTopBarBgDarkTheme;
  const textColorLightTheme = configs.headerTopBarTextLightTheme;
  const textColorDarkTheme = configs.headerTopBarTextDarkTheme;
  const isOneShopCompany = configs.isOneShopCompany;
  const showBlog = configs.showBlog;
  const textColor =
    (isDark ? textColorDarkTheme : textColorLightTheme) || 'var(--textSecondaryColor)';

  const topBarBgStyle = {
    backgroundColor:
      (isDark ? bgColorDarkTheme : bgColorLightTheme) || 'var(--secondaryBackground)',
    color: textColor,
  } as React.CSSProperties;

  const topTextColorStyle = {
    color: textColor,
  } as React.CSSProperties;

  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);
  const contactsLinkName = getConstantTranslation(`nav.contacts.${locale}`);

  return (
    <React.Fragment>
      <header
        className='sticky lg:relative top-0 z-[130] bg-primary shadow-md lg:shadow-none'
        style={
          {
            '--logoWidth': configLogoWidth,
            '--logoMobileWidth': configLogoMobileWidth,
          } as React.CSSProperties
        }
      >
        {/*top bar*/}
        <div className='relative z-[10] bg-secondary' style={topBarBgStyle}>
          <Inner className='hidden h-[30px] items-center justify-between lg:flex' lowBottom lowTop>
            <div className='flex items-center gap-6'>
              {headerPageGroups.map(({ name, _id, pages }, index) => {
                return (
                  <div
                    key={`${_id}`}
                    className='header-sub-nav font-sm relative gap-6 cursor-pointer'
                  >
                    <div
                      className='flex items-center h-[30px] text-secondary-text'
                      style={topTextColorStyle}
                    >
                      {name}
                    </div>
                    <ul className='header-sub-nav-list rounded-md bg-secondary shadow-md'>
                      {(pages || []).map(({ name, slug, _id }) => {
                        return (
                          <li className='' key={`${_id}`}>
                            <div
                              className='block py-1.5 px-3 text-primary-text hover:no-underline hover:text-theme'
                              onClick={() => {
                                window.open(`${urlPrefix}${ROUTE_DOCS_PAGES}/${slug}`, '_blank');
                              }}
                            >
                              {name}
                            </div>
                          </li>
                        );
                      })}

                      {index === 0 ? (
                        <li className=''>
                          <div
                            className='block py-1.5 px-3 text-primary-text hover:no-underline hover:text-theme'
                            onClick={() => {
                              window.open(`${urlPrefix}${ROUTE_CONTACTS}`, '_blank');
                            }}
                          >
                            {contactsLinkName}
                          </div>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                );
              })}
              {showBlog ? (
                <div
                  className='flex items-center h-[30px] text-secondary-text hover:no-underline hover:text-theme cursor-pointer'
                  style={topTextColorStyle}
                  onClick={() => {
                    window.open(`${urlPrefix}${ROUTE_BLOG_WITH_PAGE}`, '_blank');
                  }}
                >
                  {blogLinkName}
                </div>
              ) : null}
            </div>

            <div className='flex gap-6 items-center'>
              {callbackPhone && !isOneShopCompany ? (
                <LinkPhone
                  style={topTextColorStyle}
                  className='text-secondary-text'
                  value={{
                    raw: phoneToRaw(callbackPhone),
                    readable: phoneToReadable(callbackPhone),
                  }}
                />
              ) : null}

              <LanguageTrigger style={topTextColorStyle} />
              <CityTrigger style={topTextColorStyle} />
              <ThemeTrigger style={topTextColorStyle} />
            </div>
          </Inner>
        </div>

        <Inner lowTop lowBottom className='relative'>
          <div className='flex justify-between py-3 lg:py-6 lg:justify-between lg:py-4'>
            <div className={`${middleSideClassName} justify-start hidden lg:inline-flex`}>
              {isOneShopCompany && domainCompany && domainCompany.mainShop ? (
                <div className='flex items-center'>
                  <div>
                    <div
                      onClick={() => {
                        showModal<MapModalInterface>({
                          variant: MAP_MODAL,
                          props: {
                            title: `${domainCompany.mainShop?.name}`,
                            testId: `shop-map-modal`,
                            markers: [
                              {
                                _id: domainCompany.mainShop?._id,
                                icon: marker,
                                name: `${domainCompany.mainShop?.name}`,
                                address: domainCompany.mainShop?.address,
                              },
                            ],
                          },
                        });
                      }}
                      className='flex items-center gap-3 cursor-pointer hover:text-theme transition-all'
                    >
                      <div className='text-theme'>
                        <WpIcon name={'marker'} className='w-5 h-5' />
                      </div>
                      <div>{domainCompany.mainShop.address.readableAddress}</div>
                    </div>

                    <div className='flex items-center gap-3 mt-2'>
                      <div className='text-theme'>
                        <WpIcon name={'phone'} className='w-5 h-5' />
                      </div>
                      <div>
                        <LinkPhone
                          className='text-primary-text hover:text-theme transition-all'
                          value={{
                            raw: phoneToRaw(callbackPhone),
                            readable: phoneToReadable(callbackPhone),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {/*<div className={`${middleLinkClassName}`}>
                <div className={`relative mr-3`}>
                  <Icon name={'marker'} className='w-5 h-5' />
                </div>
                <span>Магазины</span>
              </div>*/}
            </div>

            <WpLink
              href={urlPrefix}
              className='flex items-center flex-shrink-0 w-[var(--logoMobileWidth)] md:w-[var(--logoWidth)] max-h-16 lg:max-h-24'
              aria-label={'Главная страница'}
            >
              <img
                className='w-full h-full object-contain object-left lg:object-center'
                src={`${siteLogoSrc}`}
                width='150'
                height='24'
                alt={`${configSiteName}`}
              />
            </WpLink>

            <div className={`${middleSideClassName} justify-end`}>
              {/*search trigger*/}
              <div
                data-cy={`header-search-trigger`}
                onClick={() => setIsSearchOpen(true)}
                className={`${middleLinkClassName} pr-2 pl-2`}
              >
                <div className={`relative`}>
                  <WpIcon name={'search'} className='w-5 h-5' />
                </div>
              </div>

              <HeaderProfileLink testId={'header'} />

              <div className={`${middleLinkClassName} hidden lg:flex pr-2 pl-2`}>
                <div className={`relative`}>
                  <WpIcon name={'compare'} className='w-5 h-5' />
                </div>
              </div>

              <div className={`${middleLinkClassName} hidden lg:flex pr-2 pl-2`}>
                <div className={`relative`}>
                  <WpIcon name={'heart'} className='w-5 h-5' />
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
                  <WpIcon name={'burger'} className={'w-6 h-6'} />
                </div>
              </div>
            </div>
          </div>
        </Inner>

        {isSearchOpen ? <HeaderSearch setIsSearchOpen={setIsSearchOpen} /> : null}
      </header>

      <StickyNav currentRubricSlug={currentRubricSlug} />

      <BurgerDropdown
        headerPageGroups={headerPageGroups}
        hideBurgerDropdown={hideBurgerDropdown}
        isBurgerDropdownOpen={isBurgerDropdownOpen}
      />
    </React.Fragment>
  );
};

export default Header;
