import * as React from 'react';
import { useConfigContext } from 'context/configContext';
import Inner from '../../../components/Inner/Inner';
import classes from './Footer.module.css';

const Footer: React.FC = () => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configSiteName = getSiteConfigSingleValue('siteName');

  return (
    <footer className={classes.footer}>
      <Inner className={classes.inner} lowBottom>
        <small className={classes.copyright}>
          © 2010-{new Date().getFullYear()} {configSiteName}™
        </small>
      </Inner>
    </footer>
  );
};

export default Footer;
