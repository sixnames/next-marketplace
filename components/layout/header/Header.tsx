import { Disclosure, Popover } from '@headlessui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { get } from 'lodash';
import ButtonCross from 'components/button/ButtonCross';
import CityTrigger from 'components/CityTrigger';
import CounterSticker from 'components/CounterSticker';
import Inner from 'components/Inner';
import LanguageTrigger from 'components/LanguageTrigger';
import LinkPhone from 'components/Link/LinkPhone';
import WpLink from 'components/Link/WpLink';
import { MapModalInterface } from 'components/Modal/MapModal';
import ThemeTrigger from 'components/ThemeTrigger';
import WpIcon from 'components/WpIcon';
import { FILTER_CATEGORY_KEY, FILTER_SEPARATOR, IMAGE_FALLBACK } from 'lib/config/common';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { MAP_MODAL } from 'lib/config/modalVariants';
import { useAppContext } from 'components/context/appContext';
import { useConfigContext } from 'components/context/configContext';
import { useLocaleContext } from 'components/context/localeContext';
import { useSiteContext } from 'components/context/siteContext';
import { useSiteUserContext } from 'components/context/siteUserContext';
import { useThemeContext } from 'components/context/themeContext';
import { PagesGroupInterface } from 'db/uiInterfaces';
import { useShopMarker } from 'hooks/useShopMarker';
import useSignOut from 'hooks/useSignOut';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { noNaN } from 'lib/numbers';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import LayoutCard from 'components/layout/LayoutCard';
import CartDropdown from 'components/layout/header/CartDropdown';
import HeaderSearch from 'components/layout/header/HeaderSearch';
import StickyNav, { StickNavInterface } from 'components/layout/header/StickyNav';

const links = getProjectLinks();

const middleLinkClassName =
  'flex items-center justify-center min-h-[3rem] text-secondary-text cursor-pointer hover:text-theme transition-colors duration-200';

interface HeaderProfileLinkInterface {
  testId: string;
}

const HeaderProfileLink: React.FC<HeaderProfileLinkInterface> = ({ testId }) => {
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
                  <WpIcon name={'user'} className='h-5 w-5' />
                </span>
              </Popover.Button>

              <Popover.Panel className='absolute top-full right-0 z-10'>
                <LayoutCard className='w-52 pb-4'>
                  <div className='pt-6 pb-6 pl-[var(--reachMenuItemHorizontalPadding)] pr-[var(--reachMenuItemHorizontalPadding)]'>
                    <div className='text-sm font-medium'>{sessionUser.me.shortName}</div>
                  </div>

                  <ul className='divide-y divide-gray-300 dark:divide-gray-600'>
                    <li>
                      <WpLink
                        testId={`${testId}-user-dropdown-profile-link`}
                        className='flex min-h-[3rem] cursor-pointer items-center py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text no-underline hover:text-theme hover:no-underline'
                        href={links.profile.url}
                      >
                        <span>Личный кабинет</span>
                      </WpLink>
                    </li>

                    {sessionUser.me.role?.isStaff &&
                    (sessionUser.me.role?.cmsNavigation || []).length > 0 ? (
                      <li>
                        <WpLink
                          testId={`${testId}-user-dropdown-cms-link`}
                          className='flex min-h-[3rem] cursor-pointer items-center py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text no-underline hover:text-theme hover:no-underline'
                          href={links.cms.url}
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
                          className='flex min-h-[3rem] cursor-pointer items-center py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text no-underline hover:text-theme hover:no-underline'
                          href={links.console.url}
                        >
                          <span>Панель управления</span>
                        </WpLink>
                      </li>
                    ) : null}

                    <li onClick={signOut}>
                      <span
                        data-cy={`${testId}-sign-out-link`}
                        className='flex min-h-[3rem] cursor-pointer items-center py-[var(--reachMenuItemVerticalPadding)] px-[var(--reachMenuItemHorizontalPadding)] text-primary-text no-underline hover:text-theme'
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
      href={links.signIn.url}
      className={`${middleLinkClassName} pr-2 pl-2`}
    >
      <span className={`relative`}>
        <WpIcon name={'user'} className='h-5 w-5' />
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
              <WpIcon name={'cart'} className='h-5 w-5' />
              <CounterSticker value={cart.productsCount} testId={'cart-counter'} />
            </span>
            <span className='hidden lg:block'>Корзина</span>
          </span>
        </Popover.Button>

        <Popover.Panel className='absolute top-[90%] right-[var(--innerBlockHorizontalPadding)] z-10'>
          <CartDropdown />
        </Popover.Panel>
      </Popover>
    );
  }

  return (
    <span data-cy={`${testId}-cart-dropdown-trigger`} className={`${middleLinkClassName} pl-2`}>
      <span className={`relative mr-3`}>
        <WpIcon name={'cart'} className='h-5 w-5' />
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
  const { navRubrics } = useSiteContext();
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
    <div className='fixed inset-0 z-[140] w-full min-w-[320px] overflow-y-auto bg-primary pt-4 pb-8'>
      <Inner className='pb-24'>
        <div className='mb-8 flex items-center justify-between'>
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
                  href={`${links.catalogue.url}/${rubric.slug}`}
                  onClick={hideBurgerDropdown}
                  testId={`main-rubric-${rubric.name}`}
                  className={`flex min-h-[var(--minLinkHeight)] flex-grow items-center justify-between text-xl font-medium ${
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
                                    href={`${links.catalogue.url}/${rubric.slug}/${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`}
                                    onClick={hideBurgerDropdown}
                                    className={`flex h-10 items-center ${
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
                                      href={`${links.catalogue.url}/${rubric.slug}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                                      onClick={hideBurgerDropdown}
                                      className={`flex h-10 items-center ${
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
                                    className='flex h-10 cursor-pointer items-center font-medium text-theme'
                                    onClick={() => {
                                      router
                                        .push(`${links.catalogue.url}/${rubricSlug}`)
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
                    <button className='absolute top-0 right-0 z-[2] flex h-[var(--minLinkHeight)] w-[var(--minLinkHeight)] flex-shrink-0 items-center justify-end text-primary-text outline-none focus:outline-none'>
                      <WpIcon name={'chevron-down'} className='h-5 w-5' />
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
                  className={`mb-3 flex flex-grow items-center justify-between text-lg font-medium`}
                >
                  {name}
                </div>

                <ul>
                  {(pages || []).map((page) => {
                    return (
                      <li className='' key={`${page._id}`}>
                        <WpLink
                          href={`${links.docs.url}/${page.slug}`}
                          onClick={hideBurgerDropdown}
                          className={`flex h-10 items-center text-secondary-text`}
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
                          href={links.contacts.url}
                          onClick={hideBurgerDropdown}
                          className={`flex h-10 items-center text-secondary-text`}
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
                className={`mb-3 flex flex-grow items-center justify-between text-lg font-medium text-primary-text`}
                onClick={() => {
                  hideBurgerDropdown();
                  window.open(links.blog.url, '_blank');
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
                className='flex cursor-pointer items-center gap-3 transition-all hover:text-theme'
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
                  <WpIcon name={'marker'} className='h-5 w-5' />
                </div>
                <div>{domainCompany.mainShop.address.readableAddress}</div>
              </div>

              <div className='mt-4 flex items-center gap-3'>
                <div className='text-theme'>
                  <WpIcon name={'phone'} className='h-5 w-5' />
                </div>
                <div>
                  <LinkPhone
                    className='text-primary-text transition-all hover:text-theme'
                    value={{
                      raw: phoneToRaw(callbackPhone),
                      readable: phoneToReadable(callbackPhone),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className='flex min-h-[3rem] cursor-pointer items-center text-secondary-text transition-colors duration-200 hover:text-theme'
            onClick={() => {
              router.push(`/#top-shops`).catch(console.log);
            }}
          >
            <div className={`relative mr-3`}>
              <WpIcon name={'marker'} className='h-5 w-5' />
            </div>
            <span>{domainCompany ? 'Наши магазины' : 'Магазины'}</span>
          </div>
        )}
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
  const router = useRouter();
  const { isDark } = useThemeContext();
  const { showModal } = useAppContext();
  const { configs, domainCompany } = useConfigContext();
  const { locale } = useLocaleContext();
  const { logoSlug } = useThemeContext();
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
        className='sticky top-0 z-[130] bg-primary shadow-md lg:relative lg:shadow-none'
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
                    className='header-sub-nav font-sm relative cursor-pointer gap-6'
                  >
                    <div
                      className='flex h-[30px] items-center text-secondary-text'
                      style={topTextColorStyle}
                    >
                      {name}
                    </div>
                    <ul className='header-sub-nav-list rounded-md bg-secondary shadow-md'>
                      {(pages || []).map(({ name, slug, _id }) => {
                        return (
                          <li className='' key={`${_id}`}>
                            <div
                              className='block py-1.5 px-3 text-primary-text hover:text-theme hover:no-underline'
                              onClick={() => {
                                window.open(`${links.docs.url}/${slug}`, '_blank');
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
                            className='block py-1.5 px-3 text-primary-text hover:text-theme hover:no-underline'
                            onClick={() => {
                              window.open(links.contacts.url, '_blank');
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
                  className='flex h-[30px] cursor-pointer items-center text-secondary-text hover:text-theme hover:no-underline'
                  style={topTextColorStyle}
                  onClick={() => {
                    window.open(links.blog.url, '_blank');
                  }}
                >
                  {blogLinkName}
                </div>
              ) : null}
            </div>

            <div className='flex items-center gap-6'>
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
          <div className='flex justify-between py-3 lg:justify-between lg:py-6 lg:py-4'>
            <div className={`${middleSideClassName} hidden justify-start lg:inline-flex`}>
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
                      className='flex cursor-pointer items-center gap-3 transition-all hover:text-theme'
                    >
                      <div className='text-theme'>
                        <WpIcon name={'marker'} className='h-5 w-5' />
                      </div>
                      <div>{domainCompany.mainShop.address.readableAddress}</div>
                    </div>

                    <div className='mt-2 flex items-center gap-3'>
                      <div className='text-theme'>
                        <WpIcon name={'phone'} className='h-5 w-5' />
                      </div>
                      <div>
                        <LinkPhone
                          className='text-primary-text transition-all hover:text-theme'
                          value={{
                            raw: phoneToRaw(callbackPhone),
                            readable: phoneToReadable(callbackPhone),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`${middleLinkClassName}`}
                  onClick={() => {
                    router.push(`/#top-shops`).catch(console.log);
                  }}
                >
                  <div className={`relative mr-3`}>
                    <WpIcon name={'marker'} className='h-5 w-5' />
                  </div>
                  <span>{domainCompany ? 'Наши магазины' : 'Магазины'}</span>
                </div>
              )}
            </div>

            <WpLink
              href={'/'}
              className='flex w-[var(--logoMobileWidth)] flex-shrink-0 items-center md:w-[var(--logoWidth)]'
              aria-label={'Главная страница'}
            >
              <img
                className='h-auto w-full object-contain object-left lg:object-center'
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
                  <WpIcon name={'search'} className='h-5 w-5' />
                </div>
              </div>

              <HeaderProfileLink testId={'header'} />

              <div className={`${middleLinkClassName} hidden pr-2 pl-2 lg:flex`}>
                <div className={`relative`}>
                  <WpIcon name={'compare'} className='h-5 w-5' />
                </div>
              </div>

              <div className={`${middleLinkClassName} hidden pr-2 pl-2 lg:flex`}>
                <div className={`relative`}>
                  <WpIcon name={'heart'} className='h-5 w-5' />
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
                  <WpIcon name={'burger'} className={'h-6 w-6'} />
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
