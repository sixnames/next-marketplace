import React, { useRef } from 'react';
import { Fragment } from 'react';
import classes from './Header.module.css';
import StickyNav from './StickyNav';
import HeaderTop from './HeaderTop';
import Link from '../../../components/Link/Link';
import { useThemeContext } from '../../../context/themeContext';
import { useConfigContext } from '../../../context/configContext';
import { ASSETS_URL } from '../../../config';
import useIsMobile from '../../../hooks/useIsMobile';
import Icon from '../../../components/Icon/Icon';
import Inner from '../../../components/Inner/Inner';

const Header: React.FC = () => {
  const { logoSlug } = useThemeContext();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement | null>(null);
  const { getSiteConfigSingleValue } = useConfigContext();

  const siteLogo = getSiteConfigSingleValue(logoSlug);
  const siteLogoSrc = `${ASSETS_URL}${siteLogo}?format=svg`;

  const configSiteName = getSiteConfigSingleValue('siteName');

  return (
    <Fragment>
      <header className={classes.frame} ref={headerRef}>
        {isMobile ? null : <HeaderTop />}
        <Inner className={classes.middle} lowTop>
          <div className={classes.middleSide}>
            <div className={`${classes.middleLink} ${classes.middleLinkBurger}`}>
              <div className={`${classes.middleLinkIconHolder}`}>
                <Icon name={'burger'} className={classes.middleLinkBurgerIcon} />
              </div>
              <span>меню</span>
            </div>

            <div className={`${classes.middleLink}`}>
              <div className={`${classes.middleLinkIconHolder}`}>
                <Icon name={'marker'} className={classes.middleLinkShopsIcon} />
              </div>
              <span>Винотеки</span>
            </div>
          </div>

          <Link href={'/'} className={classes.middleLogo} aria-label={'Главная страница'}>
            <img src={siteLogoSrc} width='166' height='27' alt={configSiteName} />
          </Link>

          <div className={classes.middleSide}>
            <div className={`${classes.middleLink}`}>
              <div
                className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}
              >
                <Icon name={'search'} className={classes.middleLinkSearchIcon} />
              </div>
            </div>
            <div className={`${classes.middleLink}`}>
              <div
                className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}
              >
                <Icon name={'user'} className={classes.middleLinkUserIcon} />
              </div>
            </div>
            <div className={`${classes.middleLink}`}>
              <div
                className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}
              >
                <Icon name={'compare'} className={classes.middleLinkCompareIcon} />
              </div>
            </div>
            <div className={`${classes.middleLink}`}>
              <div
                className={`${classes.middleLinkIconHolder} ${classes.middleLinkIconHolderNoLabel}`}
              >
                <Icon name={'heart'} className={classes.middleLinkHeartIcon} />
              </div>
            </div>

            <div className={`${classes.middleLink}`}>
              <div className={`${classes.middleLinkIconHolder}`}>
                <Icon name={'cart'} className={classes.middleLinkCartIcon} />
              </div>
              <span>Корзина</span>
            </div>
          </div>
        </Inner>
      </header>
      {isMobile ? null : <StickyNav />}
    </Fragment>
  );
};

export default Header;
