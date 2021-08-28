import { ROUTE_CATALOGUE } from 'config/common';
import {
  NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY,
  NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES,
} from 'config/constantSelects';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import { CategoryInterface, RubricAttributeInterface, RubricInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';
import Inner from 'components/Inner';
import { useSiteContext } from 'context/siteContext';
import { useRouter } from 'next/router';
import Link from 'components/Link/Link';

export const dropdownClassName =
  'wp-nav-dropdown-hidden group-hover:wp-nav-dropdown-visible bg-secondary shadow-lg';

interface AttributeStylesInterface {
  attributeLinkStyle: React.CSSProperties;
  attributeStyle: React.CSSProperties;
}

export interface StickyNavAttributeInterface extends AttributeStylesInterface {
  attribute: RubricAttributeInterface;
  rubricSlug: string;
  hideDropdown: () => void;
}

export interface StickyNavCategoryInterface extends AttributeStylesInterface {
  category: CategoryInterface;
  rubricSlug: string;
  hideDropdown: () => void;
}

interface StylesInterface extends AttributeStylesInterface {
  dropdownStyle: React.CSSProperties;
}

export interface StickyNavDropdownInterface extends StylesInterface {
  attributes: RubricAttributeInterface[] | null | undefined;
  rubricSlug: string;
  categories: CategoryInterface[];
  hideDropdown: () => void;
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
  if (catalogueNavLayout === NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY) {
    return <StickyNavDropdownOptionsOnly {...props} />;
  }

  if (catalogueNavLayout === NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES) {
    return <StickyNavDropdownWithCategories {...props} />;
  }

  return <StickyNavDropdownDefault {...props} />;
};

interface StickyNavItemInterface extends StylesInterface {
  rubric: RubricInterface;
  linkStyle: React.CSSProperties;
  categories: CategoryInterface[];
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({
  rubric,
  attributeStyle,
  linkStyle,
  attributeLinkStyle,
  dropdownStyle,
  categories,
}) => {
  const { asPath } = useRouter();
  const { name, slug, attributes } = rubric;
  const [isDropdownVisible, setIsDropdownVisible] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!isDropdownVisible) {
      const timeout = setTimeout(() => {
        setIsDropdownVisible(true);
      }, 1500);

      return () => {
        clearTimeout(timeout);
      };
    }

    return;
  }, [isDropdownVisible]);

  const hideDropdown = React.useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  // Get rubric slug from product card path
  const path = `${ROUTE_CATALOGUE}/${slug}`;
  const reg = RegExp(`${path}`);
  const isCurrent = reg.test(asPath);

  return (
    <li
      className='group px-4 first:pl-0 last:pr-0'
      data-cy={`main-rubric-list-item-${rubric.slug}`}
    >
      <Link
        href={path}
        style={linkStyle}
        testId={`main-rubric-${rubric.slug}`}
        className='relative flex items-center min-h-[var(--minLinkHeight)] uppercase font-medium text-primary-text hover:no-underline hover:text-theme'
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
        />
      ) : null}
    </li>
  );
};

const StickyNav: React.FC = () => {
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
