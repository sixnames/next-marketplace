import * as React from 'react';
import Inner from '../../../components/Inner/Inner';
import HeaderTop from '../Header/HeaderTop';
import { useSiteContext } from 'context/siteContext';
import classes from './BurgerDropdown.module.css';
import { useConfigContext } from 'context/configContext';
import Link from '../../../components/Link/Link';
import Icon from '../../../components/Icon/Icon';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from 'context/userContext';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { signOut } from 'next-auth/client';
import { CatalogueNavRubricFragment } from 'generated/apolloComponents';
import { alwaysArray } from 'lib/arrayUtils';
import { ROUTE_CMS, ROUTE_APP, ROUTE_PROFILE, ROUTE_SIGN_IN } from 'config/common';

export interface BurgerDropdownSizesInterface {
  top: number;
  height: number;
}

const BurgerDropdownChevron: React.FC = () => {
  return <Icon name={'chevron-right'} className={classes.chevronRight} />;
};

const BurgerDropdown: React.FC<BurgerDropdownSizesInterface> = ({ top, height }) => {
  const { showErrorNotification } = useNotificationsContext();
  const { isBurgerDropdownOpen, hideBurgerDropdown, catalogueNavRubrics } = useSiteContext();
  const [isCatalogueVisible, setIsCatalogueVisible] = React.useState<boolean>(true);
  const [currentRubric, setCurrentRubric] = React.useState<CatalogueNavRubricFragment | null>(null);
  const { getSiteConfigSingleValue } = useConfigContext();
  const { me } = useUserContext();
  const { asPath, query } = useRouter();
  const configSiteName = getSiteConfigSingleValue('siteName');
  const { isMobile } = useAppContext();
  const { catalogue = [] } = query;
  const realCatalogueQuery = alwaysArray(catalogue);
  const catalogueSlug = realCatalogueQuery[0];

  React.useEffect(() => {
    if (!isBurgerDropdownOpen) {
      setIsCatalogueVisible(false);
      setCurrentRubric(null);
    }
  }, [isBurgerDropdownOpen]);

  return (
    <div
      data-cy={'burger-dropdown'}
      className={`${classes.frame} ${isBurgerDropdownOpen ? classes.frameActive : ''}`}
      style={isBurgerDropdownOpen && !isMobile ? { top, height } : undefined}
    >
      <Inner lowBottom lowTop className={classes.inner}>
        <div className={classes.dropdown}>
          <div className={classes.dropdownScroll}>
            <div className={classes.dropdownContent}>
              {isMobile ? <HeaderTop /> : null}

              {isCatalogueVisible ? (
                <div>
                  <div className={classes.dropdownCatalogueTitle}>
                    <div
                      className={classes.dropdownCatalogueTrigger}
                      onClick={() =>
                        currentRubric ? setCurrentRubric(null) : setIsCatalogueVisible(false)
                      }
                    >
                      <Icon name={'arrow-left'} />
                    </div>

                    <div className={classes.dropdownCatalogueTitleName}>
                      {currentRubric ? currentRubric.name : 'Каталог товаров'}
                    </div>

                    {isMobile ? (
                      <div onClick={hideBurgerDropdown} className={classes.dropdownCatalogueClose}>
                        <Icon name={'cross'} />
                      </div>
                    ) : null}
                  </div>
                  <div className={classes.dropdownCatalogueContent}>
                    {currentRubric ? (
                      <Fragment>
                        {currentRubric.slug !== catalogueSlug ? (
                          <div className={classes.dropdownGroup}>
                            <Link
                              href={`${currentRubric.slug}`}
                              onClick={hideBurgerDropdown}
                              className={`${classes.dropdownGroupLink}`}
                            >
                              <span>Перейти в раздел</span>
                              <BurgerDropdownChevron />
                            </Link>
                          </div>
                        ) : null}

                        {currentRubric.navItems.attributes.map(
                          ({ _id, isDisabled, options, name }) => {
                            if (isDisabled) {
                              return null;
                            }
                            return (
                              <div className={classes.dropdownGroup} key={_id}>
                                <div className={classes.dropdownGroupTitle}>{name}</div>
                                <ul>
                                  {options.map((option) => {
                                    if (option.isDisabled) {
                                      return null;
                                    }
                                    const isCurrent = asPath === option.slug;
                                    return (
                                      <li key={option._id}>
                                        <Link
                                          href={option.slug}
                                          onClick={hideBurgerDropdown}
                                          className={`${classes.dropdownGroupLink} ${
                                            isCurrent ? classes.dropdownGroupLinkCurrent : ''
                                          }`}
                                        >
                                          <span>{option.name}</span>
                                          <BurgerDropdownChevron />
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          },
                        )}
                      </Fragment>
                    ) : (
                      <ul>
                        {catalogueNavRubrics.map((rubric) => {
                          const { _id, name, slug, navItems } = rubric;
                          const isCurrent = slug === catalogueSlug;
                          const { isDisabled } = navItems;

                          if (isDisabled) {
                            return null;
                          }

                          return (
                            <li key={_id} onClick={() => setCurrentRubric(rubric)}>
                              <span
                                className={`${classes.dropdownGroupLink} ${
                                  isCurrent ? classes.dropdownGroupLinkCurrent : ''
                                }`}
                              >
                                <span>{name}</span>
                                <BurgerDropdownChevron />
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className={classes.dropdownGroup}>
                    <div className={classes.dropdownGroupTitle}>Товары</div>
                    <ul>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkAccent} ${classes.dropdownGroupLinkBig}`}
                        >
                          <span>Скидки</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkBig}`}
                        >
                          <span>Бестселлеры</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={() => setIsCatalogueVisible(true)}
                          className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkBig}`}
                        >
                          <span>Каталог товаров</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkBig}`}
                        >
                          <span>Банкетный калькулятор</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className={classes.dropdownGroup}>
                    <div className={classes.dropdownGroupTitle}>Профиль</div>
                    <ul>
                      <li>
                        <Link
                          onClick={hideBurgerDropdown}
                          testId={me ? `burger-profile-link` : `burger-sign-in-link`}
                          href={me ? ROUTE_PROFILE : ROUTE_SIGN_IN}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>Личный кабинет</span>
                          <BurgerDropdownChevron />
                        </Link>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>
                          <span>Корзина</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>Сравнение</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>Избранное</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      {me ? (
                        <li>
                          <div
                            data-cy={`burger-sign-out-link`}
                            className={`${classes.dropdownGroupLink}`}
                            onClick={() => {
                              hideBurgerDropdown();
                              signOut().catch(() => {
                                showErrorNotification();
                              });
                            }}
                          >
                            <span>Выйти из аккаунта</span>
                            <BurgerDropdownChevron />
                          </div>
                        </li>
                      ) : null}
                      {me ? (
                        <React.Fragment>
                          <li>
                            <Link
                              onClick={hideBurgerDropdown}
                              href={ROUTE_CMS}
                              className={`${classes.dropdownGroupLink}`}
                            >
                              <span>CMS</span>
                              <BurgerDropdownChevron />
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={hideBurgerDropdown}
                              href={ROUTE_APP}
                              className={`${classes.dropdownGroupLink}`}
                            >
                              <span>APP</span>
                              <BurgerDropdownChevron />
                            </Link>
                          </li>
                        </React.Fragment>
                      ) : null}
                    </ul>
                  </div>

                  <div className={classes.dropdownGroup}>
                    <div className={classes.dropdownGroupTitle}>{configSiteName}</div>
                    <ul>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>О компании</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>Контакты</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>Служба поддержки</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>Винотеки</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>Вакансии</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={hideBurgerDropdown}
                          className={`${classes.dropdownGroupLink}`}
                        >
                          <span>Блог компании</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={classes.backdrop} onClick={hideBurgerDropdown} />
      </Inner>
    </div>
  );
};

export default BurgerDropdown;