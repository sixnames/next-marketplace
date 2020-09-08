import React, { useEffect, useState } from 'react';
import Inner from '../../../components/Inner/Inner';
import HeaderTop from '../Header/HeaderTop';
import useIsMobile from '../../../hooks/useIsMobile';
import { RubricType, useSiteContext } from '../../../context/siteContext';
import classes from './BurgerDropdown.module.css';
import { useConfigContext } from '../../../context/configContext';
import Link from '../../../components/Link/Link';
import { ROUTE_PROFILE, ROUTE_SIGN_IN } from '../../../config';
import Icon from '../../../components/Icon/Icon';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import useSignOut from '../../../hooks/useSignOut';
import { useUserContext } from '../../../context/userContext';

export interface BurgerDropdownSizesInterface {
  top: number;
  height: number;
}

const BurgerDropdownChevron: React.FC = () => {
  const isMobile = useIsMobile();
  return isMobile ? <Icon name={'chevron-right'} className={classes.chevronRight} /> : null;
};

const BurgerDropdown: React.FC<BurgerDropdownSizesInterface> = ({ top, height }) => {
  const { isBurgerDropdownOpen, hideBurgerDropdown, getRubricsTree } = useSiteContext();
  const [isCatalogueVisible, setIsCatalogueVisible] = useState<boolean>(true);
  const [currentRubric, setCurrentRubric] = useState<RubricType | null>(null);
  const { getSiteConfigSingleValue } = useConfigContext();
  const { me } = useUserContext();
  const signOutHandler = useSignOut();
  const { asPath, query } = useRouter();
  const configSiteName = getSiteConfigSingleValue('siteName');
  const isMobile = useIsMobile();
  const { catalogue = [] } = query;
  const catalogueSlug = catalogue[0];

  useEffect(() => {
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
                      {currentRubric ? currentRubric.nameString : 'Каталог товаров'}
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
                              href={{
                                pathname: `/[...catalogue]`,
                              }}
                              as={{
                                pathname: `${currentRubric.slug}`,
                              }}
                              onClick={hideBurgerDropdown}
                              className={`${classes.dropdownGroupLink}`}
                            >
                              <span>Перейти в раздел</span>
                              <BurgerDropdownChevron />
                            </Link>
                          </div>
                        ) : null}

                        {currentRubric.filterAttributes.map(({ id, node, options }) => {
                          return (
                            <div className={classes.dropdownGroup} key={id}>
                              <div className={classes.dropdownGroupTitle}>{node.nameString}</div>
                              <ul>
                                {options.map((option) => {
                                  const optionPath = `/${currentRubric?.slug}/${node.slug}-${option.slug}`;
                                  const isCurrent = asPath === optionPath;
                                  return (
                                    <li key={option.id}>
                                      <Link
                                        href={{
                                          pathname: `/[...catalogue]`,
                                        }}
                                        as={{
                                          pathname: optionPath,
                                        }}
                                        onClick={hideBurgerDropdown}
                                        className={`${classes.dropdownGroupLink} ${
                                          isCurrent ? classes.dropdownGroupLinkCurrent : ''
                                        }`}
                                      >
                                        <span>{option.filterNameString}</span>
                                        <BurgerDropdownChevron />
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}
                      </Fragment>
                    ) : (
                      <ul>
                        {getRubricsTree.map((rubric) => {
                          const { id, nameString, slug } = rubric;
                          const isCurrent = slug === catalogueSlug;
                          return (
                            <li key={id} onClick={() => setCurrentRubric(rubric)}>
                              <span
                                className={`${classes.dropdownGroupLink} ${
                                  isCurrent ? classes.dropdownGroupLinkCurrent : ''
                                }`}
                              >
                                <span>{nameString}</span>
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
                          className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkAccent} ${classes.dropdownGroupLinkBig}`}
                        >
                          <span>Скидки</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span
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
                        <span className={`${classes.dropdownGroupLink}`}>
                          <span>Сравнение</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>
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
                              signOutHandler();
                            }}
                          >
                            <span>Выйти из аккаунта</span>
                            <BurgerDropdownChevron />
                          </div>
                        </li>
                      ) : null}
                    </ul>
                  </div>

                  <div className={classes.dropdownGroup}>
                    <div className={classes.dropdownGroupTitle}>{configSiteName}</div>
                    <ul>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>
                          <span>О компании</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>
                          <span>Контакты</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>
                          <span>Служба поддержки</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>
                          <span>Винотеки</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>
                          <span>Вакансии</span>
                          <BurgerDropdownChevron />
                        </span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>
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
