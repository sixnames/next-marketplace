import { ROUTE_CATALOGUE } from 'config/common';
import {
  NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY,
  NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES,
} from 'config/constantSelects';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import { CategoryInterface, AttributeInterface, RubricInterface } from 'db/uiInterfaces';
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
  attribute: AttributeInterface;
  rubricSlug: string;
  hideDropdown: () => void;
  urlPrefix?: string;
}

export interface StickyNavCategoryInterface extends AttributeStylesInterface {
  category: CategoryInterface;
  rubricSlug: string;
  hideDropdown: () => void;
  urlPrefix?: string;
}

interface StylesInterface extends AttributeStylesInterface {
  dropdownStyle: React.CSSProperties;
}

export interface StickyNavDropdownInterface extends StylesInterface {
  attributes: AttributeInterface[] | null | undefined;
  rubricSlug: string;
  categories: CategoryInterface[];
  hideDropdown: () => void;
  urlPrefix?: string;
}

export interface StickyNavDropdownGlobalInterface extends StickyNavDropdownInterface {
  catalogueNavLayout: string;
}

const StickyNavDropdownDefault = dynamic(() => import('layout/header/StickyNavDropdownDefault'));

const StickyNavDropdownOptionsOnly = dynamic(
  () => import('layout/header/StickyNavDropdownOptionsOnly'),
);

const StickyNavDropdownWithCategories = dynamic(
  () => import('layout/header/StickyNavDropdownWithCategories'),
);

const StickyNavDropdown: React.FC<StickyNavDropdownGlobalInterface> = ({
  catalogueNavLayout,
  ...props
}) => {
  let dropDownLayout = <StickyNavDropdownDefault {...props} />;
  if (catalogueNavLayout === NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY) {
    dropDownLayout = <StickyNavDropdownOptionsOnly {...props} />;
  }

  if (catalogueNavLayout === NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES) {
    dropDownLayout = <StickyNavDropdownWithCategories {...props} />;
  }

  return (
    <div
      style={props.dropdownStyle}
      data-cy={'header-nav-dropdown'}
      className='wp-nav-dropdown-hidden group-hover:wp-nav-dropdown-visible bg-secondary shadow-lg'
    >
      <Inner>{dropDownLayout}</Inner>
    </div>
  );
};

interface StickyNavItemInterface extends StylesInterface {
  rubric: RubricInterface;
  linkStyle: React.CSSProperties;
  categories: CategoryInterface[];
  currentRubricSlug?: string;
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({
  rubric,
  attributeStyle,
  linkStyle,
  attributeLinkStyle,
  dropdownStyle,
  categories,
  currentRubricSlug,
}) => {
  const { asPath } = useRouter();
  const { urlPrefix } = useSiteContext();
  const { name, slug, attributes } = rubric;
  const [isDropdownVisible, setIsDropdownVisible] = React.useState<boolean>(true);

  const hideDropdown = React.useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  // Get rubric slug from product card path
  const path = `${urlPrefix}${ROUTE_CATALOGUE}/${slug}`;
  const reg = RegExp(`${path}`);
  const isCurrent = reg.test(asPath) || slug === currentRubricSlug;

  return (
    <li
      className='group px-4 first:pl-0 last:pr-0'
      data-cy={`main-rubric-list-item-${rubric.slug}`}
      onMouseLeave={() => setIsDropdownVisible(true)}
    >
      <Link
        href={path}
        style={linkStyle}
        testId={`main-rubric-${rubric.slug}`}
        onClick={hideDropdown}
        className='relative flex items-center h-12 uppercase font-medium text-primary-text hover:no-underline hover:text-theme'
      >
        {name}
        {isCurrent ? (
          <span className='absolute bottom-0 inset-x-0 w-full h-[2px] bg-theme' />
        ) : null}
      </Link>

      {isDropdownVisible ? (
        <StickyNavDropdown
          hideDropdown={hideDropdown}
          categories={categories}
          attributeLinkStyle={attributeLinkStyle}
          attributeStyle={attributeStyle}
          dropdownStyle={dropdownStyle}
          rubricSlug={slug}
          attributes={attributes}
          catalogueNavLayout={`${rubric.variant?.catalogueNavLayout}`}
          urlPrefix={urlPrefix}
        />
      ) : null}
    </li>
  );
};

export interface StickNavInterface {
  currentRubricSlug?: string;
}

const StickyNav: React.FC<StickNavInterface> = ({ currentRubricSlug }) => {
  const { navRubrics } = useSiteContext();
  const { isDark } = useThemeContext();
  const { configs } = useConfigContext();

  // styles
  const linkStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      color:
        (isDark ? configs.siteNavBarTextDarkTheme : configs.siteNavBarTextLightTheme) ||
        'var(--textColor)',
    };
  }, [configs.siteNavBarTextDarkTheme, configs.siteNavBarTextLightTheme, isDark]);

  const dropdownStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      backgroundColor:
        (isDark ? configs.siteNavDropdownBgDarkTheme : configs.siteNavDropdownBgLightTheme) ||
        'var(--secondaryBackground)',
    };
  }, [configs.siteNavDropdownBgDarkTheme, configs.siteNavDropdownBgLightTheme, isDark]);

  const attributeLinkStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      color:
        (isDark ? configs.siteNavDropdownTextDarkTheme : configs.siteNavDropdownTextLightTheme) ||
        'var(--textSecondaryColor)',
    };
  }, [configs.siteNavDropdownTextDarkTheme, configs.siteNavDropdownTextLightTheme, isDark]);

  const attributeStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      color:
        (isDark
          ? configs.siteNavDropdownAttributeDarkTheme
          : configs.siteNavDropdownAttributeLightTheme) || 'var(--textColor)',
    };
  }, [
    configs.siteNavDropdownAttributeDarkTheme,
    configs.siteNavDropdownAttributeLightTheme,
    isDark,
  ]);

  const style = React.useMemo<React.CSSProperties>(() => {
    return {
      backgroundColor:
        (isDark ? configs.siteNavBarBgDarkTheme : configs.siteNavBarBgLightTheme) ||
        'var(--secondaryBackground)',
    };
  }, [configs.siteNavBarBgDarkTheme, configs.siteNavBarBgLightTheme, isDark]);

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
                currentRubricSlug={currentRubricSlug}
                categories={rubric.categories || []}
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
