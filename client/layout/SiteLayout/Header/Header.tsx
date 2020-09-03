import React, { useRef } from 'react';
import Inner from '../../../components/Inner/Inner';
import HeaderSearch from './HeaderSearch';
import HeaderUi from './HeaderUI';
import HeaderNav from './HeaderNav';
import useIsMobile from '../../../hooks/useIsMobile';
import HeaderMobile from './HeaderMobile';
import classes from './Header.module.css';
import { useThemeContext } from '../../../context/themeContext';
import { useLanguageContext } from '../../../context/languageContext';
import { InitialSiteQueryQuery } from '../../../generated/apolloComponents';
import { useConfigContext } from '../../../context/configContext';
import Link from '../../../components/Link/Link';
import { ASSETS_URL } from '../../../config';
import ThemeTrigger from '../../../components/ThemeTrigger/ThemeTrigger';

export type HeaderRubricType = Omit<InitialSiteQueryQuery['getRubricsTree'][0], 'children'>;

export interface HeaderRubricInterface extends HeaderRubricType {
  children?: HeaderRubricType[];
}

const Header: React.FC = () => {
  const { logoSlug } = useThemeContext();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement | null>(null);
  const { languagesList, setLanguage, isCurrentLanguage } = useLanguageContext();
  const { getSiteConfigSingleValue } = useConfigContext();

  const siteLogo = getSiteConfigSingleValue(logoSlug);
  const siteLogoSrc = `${ASSETS_URL}${siteLogo}?format=svg`;

  const configSiteName = getSiteConfigSingleValue('siteName');
  const configContactPhone = getSiteConfigSingleValue('contactPhone');

  return (
    <header className={classes.frame} ref={headerRef}>
      <div className={classes.top}>
        <Inner lowTop lowBottom className={classes.inner}>
          {languagesList.length > 1 ? (
            <div className={classes.language}>
              {languagesList.map(({ nativeName, key }) => {
                return (
                  <div
                    key={key}
                    onClick={() => setLanguage(key)}
                    className={`${classes.languageItem} ${
                      isCurrentLanguage(key) ? classes.languageItemActive : ''
                    }`}
                  >
                    {nativeName}
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className={classes.topRight}>
            <a href={`tel:${configContactPhone}`}>{configContactPhone}</a>

            <div className={classes.topNavItem}>
              <div className={classes.topLink}>Заказать звонок</div>
            </div>

            <div className={`${classes.topNavItem}`}>
              <ThemeTrigger />
            </div>
          </div>
        </Inner>
      </div>

      <Inner className={classes.middle} lowTop lowBottom>
        <Link href={'/'} className={classes.logo} aria-label={'Главная страница'}>
          <img src={siteLogoSrc} width='166' height='27' alt={configSiteName} />
        </Link>

        <HeaderSearch />

        {isMobile && <HeaderMobile headerRef={headerRef} />}

        <HeaderUi />
      </Inner>
      {!isMobile && <HeaderNav />}
    </header>
  );
};

export default Header;
