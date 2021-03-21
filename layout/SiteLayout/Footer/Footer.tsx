import Link from 'components/Link/Link';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import Image from 'next/image';
import * as React from 'react';
import Inner from '../../../components/Inner/Inner';
import classes from './Footer.module.css';

const Footer: React.FC = () => {
  const { logoSlug } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();

  const siteLogoSrc = getSiteConfigSingleValue(logoSlug);
  const configSiteName = getSiteConfigSingleValue('siteName');

  return (
    <footer className={classes.frame}>
      <Inner className={classes.inner} lowBottom>
        <Link href={`/`} className={classes.logo} aria-label={'Главная страница'}>
          <Image src={siteLogoSrc} width={166} height={27} alt={configSiteName} />
        </Link>
        <small className={classes.copyright}>
          © 2010-{new Date().getFullYear()} {configSiteName}™
        </small>
      </Inner>
    </footer>
  );
};

export default Footer;
