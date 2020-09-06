import React, { useEffect, useState } from 'react';
import Inner from '../../../components/Inner/Inner';
import HeaderTop from '../Header/HeaderTop';
import useIsMobile from '../../../hooks/useIsMobile';
import { RubricType, useSiteContext } from '../../../context/siteContext';
import AnimateOpacity from '../../../components/AnimateOpacity/AnimateOpacity';
import classes from './BurgerDropdown.module.css';
import { useConfigContext } from '../../../context/configContext';
import Link from '../../../components/Link/Link';
import { ROUTE_PROFILE } from '../../../config';
import Icon from '../../../components/Icon/Icon';
import { Fragment } from 'react';
import { useRouter } from 'next/router';

export interface BurgerDropdownSizesInterface {
  top: number;
  height: number;
}

const BurgerDropdown: React.FC<BurgerDropdownSizesInterface> = ({ top, height }) => {
  const { isBurgerDropdownOpen, hideBurgerDropdown, getRubricsTree } = useSiteContext();
  const [isCatalogueVisible, setIsCatalogueVisible] = useState<boolean>(true);
  const [currentRubric, setCurrentRubric] = useState<RubricType | null>(null);
  const { getSiteConfigSingleValue } = useConfigContext();
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

  return isBurgerDropdownOpen ? (
    <AnimateOpacity className={classes.frame} style={{ top, height }}>
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
                    {currentRubric ? currentRubric.nameString : 'Каталог товаров'}
                  </div>
                  <div className={classes.dropdownCatalogueContent}>
                    {currentRubric ? (
                      <Fragment>
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
                                        {option.filterNameString}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}

                        {currentRubric.slug !== catalogueSlug ? (
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
                            Перейти в раздел
                          </Link>
                        ) : null}
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
                                {nameString}
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
                          Скидки
                        </span>
                      </li>
                      <li>
                        <span
                          className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkBig}`}
                        >
                          Бестселлеры
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={() => setIsCatalogueVisible(true)}
                          className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkBig}`}
                        >
                          Каталог товаров
                        </span>
                      </li>
                      <li>
                        <span
                          className={`${classes.dropdownGroupLink} ${classes.dropdownGroupLinkBig}`}
                        >
                          Банкетный калькулятор
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className={classes.dropdownGroup}>
                    <div className={classes.dropdownGroupTitle}>Профиль</div>
                    <ul>
                      <li>
                        <Link href={ROUTE_PROFILE} className={`${classes.dropdownGroupLink}`}>
                          Личный кабинет
                        </Link>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>Корзина</span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>Сравнение</span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>Избранное</span>
                      </li>
                    </ul>
                  </div>

                  <div className={classes.dropdownGroup}>
                    <div className={classes.dropdownGroupTitle}>{configSiteName}</div>
                    <ul>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>О компании</span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>Контакты</span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>Служба поддержки</span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>Винотеки</span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>Вакансии</span>
                      </li>
                      <li>
                        <span className={`${classes.dropdownGroupLink}`}>Блог компании</span>
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
    </AnimateOpacity>
  ) : null;
};

export default BurgerDropdown;
