import React, { useRef } from 'react';
import { Fragment } from 'react';
import classes from './Header.module.css';
import StickyNav from './StickyNav';
import HeaderTop from './HeaderTop';
// import { useThemeContext } from '../../../context/themeContext';
// import { useConfigContext } from '../../../context/configContext';

const Header: React.FC = () => {
  // const { logoSlug } = useThemeContext();
  // const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement | null>(null);
  // const { languagesList, setLanguage, isCurrentLanguage } = useLanguageContext();
  // const { getSiteConfigSingleValue } = useConfigContext();

  // const siteLogo = getSiteConfigSingleValue(logoSlug);
  // const siteLogoSrc = `${ASSETS_URL}${siteLogo}?format=svg`;

  // const configSiteName = getSiteConfigSingleValue('siteName');
  // const configContactPhone = getSiteConfigSingleValue('contactPhone');

  return (
    <Fragment>
      <header className={classes.frame} ref={headerRef}>
        <HeaderTop />
        <div />
      </header>
      <StickyNav />
    </Fragment>
  );
};

export default Header;
