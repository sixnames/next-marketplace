import * as React from 'react';
import { useConfigContext } from 'context/configContext';
import Inner from 'components/Inner/Inner';

const Footer: React.FC = () => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configSiteName = getSiteConfigSingleValue('siteName');
  const configSiteFoundationYear = getSiteConfigSingleValue('siteFoundationYear');

  return (
    <footer className='footer relative z-[100] pt-6 pb-mobile-nav-height wp-desktop:pb-8 bg-primary-background'>
      <Inner className='flex flex-wrap items-center justify-between'>
        <small className='text-secondary-text text-base'>
          © {configSiteFoundationYear}-{new Date().getFullYear()} {configSiteName}™
        </small>
      </Inner>
    </footer>
  );
};

export default Footer;
