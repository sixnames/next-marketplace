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
        <div className={classes.middle}>
          <div className={classes.middleSide} />
          <Link href={'/'} className={classes.middleLogo} aria-label={'Главная страница'}>
            <img src={siteLogoSrc} width='166' height='27' alt={configSiteName} />
          </Link>
          <div className={classes.middleSide} />
        </div>
      </header>
      {isMobile ? null : <StickyNav />}
    </Fragment>
  );
};

export default Header;
