import { ROUTE_CATALOGUE } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import { RubricAttributeInterface, RubricInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';
import Inner from 'components/Inner';
import { useSiteContext } from 'context/siteContext';
import { useRouter } from 'next/router';
import Link from 'components/Link/Link';

interface AttributeStylesInterface {
  attributeLinkStyle: React.CSSProperties;
  attributeStyle: React.CSSProperties;
}

export interface StickyNavAttributeInterface extends AttributeStylesInterface {
  attribute: RubricAttributeInterface;
  hideDropdownHandler: () => void;
  rubricSlug: string;
}

interface StylesInterface extends AttributeStylesInterface {
  dropdownStyle: React.CSSProperties;
}

export interface StickyNavDropdownInterface extends StylesInterface {
  attributes: RubricAttributeInterface[] | null | undefined;
  isDropdownOpen: boolean;
  hideDropdownHandler: () => void;
  rubricSlug: string;
}

export interface StickyNavDropdownGlobalInterface extends StickyNavDropdownInterface {
  catalogueNavLayout: string;
}

const StickyNavDropdownDefault = dynamic(() => import('layout/header/StickyNavDropdownDefault'));

const StickyNavDropdown: React.FC<StickyNavDropdownGlobalInterface> = ({
  catalogueNavLayout,
  ...props
}) => {
  return <StickyNavDropdownDefault {...props} />;
};

interface StickyNavItemInterface extends StylesInterface {
  rubric: RubricInterface;
  linkStyle: React.CSSProperties;
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({
  rubric,
  attributeStyle,
  linkStyle,
  attributeLinkStyle,
  dropdownStyle,
}) => {
  const { asPath } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  const { name, slug, attributes } = rubric;

  // Get rubric slug from product card path
  const path = `${ROUTE_CATALOGUE}/${slug}`;
  const reg = RegExp(`${path}`);
  const isCurrent = reg.test(asPath);

  function showDropdownHandler() {
    setIsDropdownOpen(true);
  }

  function hideDropdownHandler() {
    setIsDropdownOpen(false);
  }

  return (
    <li
      onMouseEnter={showDropdownHandler}
      onMouseLeave={hideDropdownHandler}
      data-cy={`main-rubric-list-item-${rubric.slug}`}
    >
      <Link
        href={path}
        style={linkStyle}
        onClick={hideDropdownHandler}
        testId={`main-rubric-${rubric.slug}`}
        className='relative flex items-center min-h-[var(--minLinkHeight)] uppercase font-medium text-primary-text hover:no-underline hover:text-theme'
      >
        {name}
        {isCurrent ? (
          <span className='absolute bottom-0 inset-x-0 w-full h-[2px] bg-theme' />
        ) : null}
      </Link>

      <StickyNavDropdown
        attributeLinkStyle={attributeLinkStyle}
        attributeStyle={attributeStyle}
        dropdownStyle={dropdownStyle}
        hideDropdownHandler={hideDropdownHandler}
        isDropdownOpen={isDropdownOpen}
        rubricSlug={slug}
        attributes={attributes}
        catalogueNavLayout={`${rubric.variant?.catalogueNavLayout}`}
      />
    </li>
  );
};

const StickyNav: React.FC = () => {
  const { navRubrics } = useSiteContext();
  const { isDark } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const bgColorLightTheme = getSiteConfigSingleValue('siteNavBarBgLightTheme');
  const bgColorDarkTheme = getSiteConfigSingleValue('siteNavBarBgDarkTheme');
  const textColorLightTheme = getSiteConfigSingleValue('siteNavBarTextLightTheme');
  const textColorDarkTheme = getSiteConfigSingleValue('siteNavBarTextDarkTheme');
  const dropDownBgLightTheme = getSiteConfigSingleValue('siteNavDropdownBgLightTheme');
  const dropDownBgDarkTheme = getSiteConfigSingleValue('siteNavDropdownBgDarkTheme');
  const linkColorLightTheme = getSiteConfigSingleValue('siteNavDropdownTextLightTheme');
  const linkColorDarkTheme = getSiteConfigSingleValue('siteNavDropdownTextDarkTheme');
  const attributeColorLightTheme = getSiteConfigSingleValue('siteNavDropdownAttributeLightTheme');
  const attributeColorDarkTheme = getSiteConfigSingleValue('siteNavDropdownAttributeDarkTheme');

  // styles
  const linkStyle = {
    color: (isDark ? textColorDarkTheme : textColorLightTheme) || 'var(--textColor)',
  } as React.CSSProperties;

  const dropdownStyle = {
    backgroundColor:
      (isDark ? dropDownBgDarkTheme : dropDownBgLightTheme) || 'var(--secondaryBackground)',
  } as React.CSSProperties;

  const attributeLinkStyle = {
    color: (isDark ? linkColorDarkTheme : linkColorLightTheme) || 'var(--textSecondaryColor)',
  } as React.CSSProperties;

  const attributeStyle = {
    color: (isDark ? attributeColorDarkTheme : attributeColorLightTheme) || 'var(--textColor)',
  } as React.CSSProperties;

  const style = {
    backgroundColor:
      (isDark ? bgColorDarkTheme : bgColorLightTheme) || 'var(--secondaryBackground)',
  } as React.CSSProperties;

  return (
    <nav
      style={style}
      data-cy={'sticky-nav'}
      className='hidden sticky -top-1 left-0 z-[70] w-full shadow-lg bg-secondary lg:block'
    >
      <Inner lowBottom lowTop>
        <ul className='flex justify-between'>
          {navRubrics.map((rubric) => {
            return (
              <StickyNavItem
                linkStyle={linkStyle}
                attributeLinkStyle={attributeLinkStyle}
                dropdownStyle={dropdownStyle}
                attributeStyle={attributeStyle}
                rubric={rubric}
                key={`${rubric._id}`}
              />
            );
          })}
        </ul>
      </Inner>
    </nav>
  );
};

export default StickyNav;
