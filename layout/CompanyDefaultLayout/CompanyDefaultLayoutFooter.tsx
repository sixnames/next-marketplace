import Inner from 'components/Inner/Inner';
import * as React from 'react';
import { useConfigContext } from 'context/configContext';

const CompanyDefaultLayoutFooter: React.FC = () => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configSiteName = getSiteConfigSingleValue('siteName');

  return (
    <footer className='footer relative z-[100] pt-6 pb-[var(--mobileFooterPaddingBottom)] wp-desktop:pb-8 bg-primary-background'>
      <Inner className='flex flex-wrap items-center justify-between' lowBottom>
        <small className='text-secondary-text text-base'>
          © 2010-{new Date().getFullYear()} {configSiteName}™
        </small>
      </Inner>
    </footer>
  );
};

export default CompanyDefaultLayoutFooter;
