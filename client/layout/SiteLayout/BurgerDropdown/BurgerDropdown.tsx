import React from 'react';
import Inner from '../../../components/Inner/Inner';
import HeaderTop from '../Header/HeaderTop';
import useIsMobile from '../../../hooks/useIsMobile';
import { useSiteContext } from '../../../context/siteContext';
import AnimateOpacity from '../../../components/AnimateOpacity/AnimateOpacity';
import classes from './BurgerDropdown.module.css';
import { useConfigContext } from '../../../context/configContext';

export interface BurgerDropdownSizesInterface {
  top: number;
  height: number;
}

const BurgerDropdown: React.FC<BurgerDropdownSizesInterface> = ({ top, height }) => {
  const { isBurgerDropdownOpen, hideBurgerDropdown } = useSiteContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const configSiteName = getSiteConfigSingleValue('siteName');
  const isMobile = useIsMobile();

  return isBurgerDropdownOpen ? (
    <AnimateOpacity className={classes.frame} style={{ top, height }}>
      <Inner lowBottom lowTop className={classes.inner}>
        <div className={classes.dropdown}>
          <div className={classes.dropdownScroll}>
            <div className={classes.dropdownContent}>
              {isMobile ? <HeaderTop /> : null}

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
                      <span className={`${classes.dropdownGroupLink}`}>Личный кабинет</span>
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
            </div>
          </div>
        </div>
        <div className={classes.backdrop} onClick={hideBurgerDropdown} />
      </Inner>
    </AnimateOpacity>
  ) : null;
};

export default BurgerDropdown;
