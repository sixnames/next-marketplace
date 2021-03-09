import { RubricModel } from 'db/dbModels';
import * as React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import Inner from '../../../components/Inner/Inner';
import HeaderTop from '../Header/HeaderTop';
import { useSiteContext } from 'context/siteContext';
import classes from './BurgerDropdown.module.css';
import { useConfigContext } from 'context/configContext';
import Link from '../../../components/Link/Link';
import Icon from '../../../components/Icon/Icon';
import { useRouter } from 'next/router';
import { useUserContext } from 'context/userContext';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { signOut } from 'next-auth/client';
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
  const {
    isBurgerDropdownOpen,
    hideBurgerDropdown,
    catalogueNavRubrics,
    fixBodyScroll,
  } = useSiteContext();
  const [isCatalogueVisible, setIsCatalogueVisible] = React.useState<boolean>(true);
  const [currentRubric, setCurrentRubric] = React.useState<RubricModel | null>(null);
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

  function hideDropdownHandler() {
    fixBodyScroll(false);
    hideBurgerDropdown();
  }

  return (
    <div
      data-cy={'burger-dropdown'}
      className={`${classes.frame} ${isBurgerDropdownOpen ? classes.frameActive : ''}`}
      style={isBurgerDropdownOpen && !isMobile ? { top, height } : undefined}
    >
      <Inner lowBottom lowTop className={classes.inner}>
        <div className={classes.dropdown}>
          <div className={classes.dropdownScroll}>
            <OutsideClickHandler onOutsideClick={hideDropdownHandler}>
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
                        <div
                          onClick={hideDropdownHandler}
                          className={classes.dropdownCatalogueClose}
                        >
                          <Icon name={'cross'} />
                        </div>
                      ) : null}
                    </div>
                    <div className={classes.dropdownCatalogueContent}>
                      {currentRubric ? (
                        <React.Fragment>
                          {currentRubric.slug !== catalogueSlug ? (
                            <div className={classes.dropdownGroup}>
                              <Link
                                href={`/${query.city}/${currentRubric.slug}`}
                                onClick={hideDropdownHandler}
                                className={`${classes.dropdownGroupLink}`}
                              >
                                <span>Перейти в раздел</span>
                                <BurgerDropdownChevron />
                              </Link>
                            </div>
                          ) : null}

                          {(currentRubric.navItems || []).map(({ _id, options, name }) => {
                            return (
                              <div className={classes.dropdownGroup} key={`${_id}`}>
                                <div className={classes.dropdownGroupTitle}>{name}</div>
                                <ul>
                                  {options.map((option) => {
                                    const isCurrent = asPath === option.slug;
                                    return (
                                      <li key={`${option._id}`}>
                                        <Link
                                          href={`/${query.city}/${currentRubric.slug}/${option.slug}`}
                                          onClick={hideDropdownHandler}
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
                          })}
                        </React.Fragment>
                      ) : (
                        <ul>
                          {catalogueNavRubrics.map((rubric) => {
                            const { _id, name, slug } = rubric;
                            const isCurrent = slug === catalogueSlug;

                            return (
                              <li key={`${_id}`} onClick={() => setCurrentRubric(rubric)}>
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
                            onClick={hideDropdownHandler}
                            className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkAccent} ${classes.dropdownGroupLinkBig}`}
                          >
                            <span>Скидки</span>
                            <BurgerDropdownChevron />
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={hideDropdownHandler}
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
                            onClick={hideDropdownHandler}
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
                            onClick={hideDropdownHandler}
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
                            onClick={hideDropdownHandler}
                            className={`${classes.dropdownGroupLink}`}
                          >
                            <span>Сравнение</span>
                            <BurgerDropdownChevron />
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={hideDropdownHandler}
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
                                hideDropdownHandler();
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
                                onClick={hideDropdownHandler}
                                href={`/${query.city}${ROUTE_CMS}`}
                                className={`${classes.dropdownGroupLink}`}
                              >
                                <span>CMS</span>
                                <BurgerDropdownChevron />
                              </Link>
                            </li>
                            <li>
                              <Link
                                onClick={hideDropdownHandler}
                                href={`/${query.city}${ROUTE_APP}`}
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
                            onClick={hideDropdownHandler}
                            className={`${classes.dropdownGroupLink}`}
                          >
                            <span>О компании</span>
                            <BurgerDropdownChevron />
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={hideDropdownHandler}
                            className={`${classes.dropdownGroupLink}`}
                          >
                            <span>Контакты</span>
                            <BurgerDropdownChevron />
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={hideDropdownHandler}
                            className={`${classes.dropdownGroupLink}`}
                          >
                            <span>Служба поддержки</span>
                            <BurgerDropdownChevron />
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={hideDropdownHandler}
                            className={`${classes.dropdownGroupLink}`}
                          >
                            <span>Винотеки</span>
                            <BurgerDropdownChevron />
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={hideDropdownHandler}
                            className={`${classes.dropdownGroupLink}`}
                          >
                            <span>Вакансии</span>
                            <BurgerDropdownChevron />
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={hideDropdownHandler}
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
            </OutsideClickHandler>
          </div>
        </div>
      </Inner>
    </div>
  );
};

export default BurgerDropdown;
