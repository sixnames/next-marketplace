import Inner from 'components/Inner/Inner';
import LanguageTrigger from 'components/LanguageTrigger/LanguageTrigger';
import ThemeTrigger from 'components/ThemeTrigger/ThemeTrigger';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import { useGetCatalogueSearchTopItemsQuery } from 'generated/apolloComponents';
import classes from 'layout/SiteLayout/Header/Header.module.css';
import * as React from 'react';

const CompanyDefaultLayoutHeader: React.FC = () => {
  const [isBurgerDropdownOpen, setIsBurgerDropdownOpen] = React.useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { logoSlug } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const { data } = useGetCatalogueSearchTopItemsQuery({
    ssr: false,
    variables: {
      input: {},
    },
  });

  const siteLogoConfig = getSiteConfigSingleValue(logoSlug);
  const siteLogoSrc = siteLogoConfig || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
  const configSiteName = getSiteConfigSingleValue('siteName');

  const toggleBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen((prevState) => !prevState);
  }, []);

  const hideBurgerDropdown = React.useCallback(() => {
    setIsBurgerDropdownOpen(false);
  }, []);

  const headerVars = { '--logo-width': '10rem' } as React.CSSProperties;

  return (
    <React.Fragment>
      <header
        className='relative z-[130] bg-primary-background shadow-md wp-desktop:shadow-none'
        style={headerVars}
        ref={headerRef}
      >
        <Inner
          className='hidden relative z-[10] h-[30px] items-center justify-between wp-desktop:flex'
          lowBottom
          lowTop
        >
          <ThemeTrigger />
          <LanguageTrigger />
        </Inner>
      </header>
    </React.Fragment>
  );
};

export default CompanyDefaultLayoutHeader;
