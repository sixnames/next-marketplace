import dynamic from 'next/dynamic';
import * as React from 'react';
import { useRouter } from 'next/router';
import Inner from '../../components/Inner';
import WpLink from '../../components/Link/WpLink';
import { FILTER_CATEGORY_KEY, FILTER_SEPARATOR } from '../../config/common';
import {
  NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY,
  NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES,
  NAV_DROPDOWN_LAYOUT_WITHOUT_SUBCATEGORIES,
} from '../../config/constantSelects';
import { useConfigContext } from '../../context/configContext';
import { useSiteContext } from '../../context/siteContext';
import { useThemeContext } from '../../context/themeContext';
import { AttributeInterface, CategoryInterface, RubricInterface } from '../../db/uiInterfaces';
import { getProjectLinks } from '../../lib/getProjectLinks';

interface AttributeStylesInterface {
  attributeLinkStyle: React.CSSProperties;
  attributeStyle: React.CSSProperties;
}

export interface StickyNavAttributeInterface extends AttributeStylesInterface {
  attribute: AttributeInterface;
  hideDropdown: () => void;
  parentHref: string;
}

export interface StickyNavCategoryInterface extends AttributeStylesInterface {
  category: CategoryInterface;
  hideDropdown: () => void;
  parentHref: string;
}

interface StylesInterface extends AttributeStylesInterface {
  dropdownStyle: React.CSSProperties;
}

export interface StickyNavDropdownInterface extends StylesInterface {
  attributes: AttributeInterface[] | null | undefined;
  navCategoryColumns: number;
  categories: CategoryInterface[];
  hideDropdown: () => void;
  parentHref: string;
}

export interface StickyNavDropdownGlobalInterface extends StickyNavDropdownInterface {
  catalogueNavLayout: string;
}

const StickyNavDropdownDefault = dynamic(() => import('./StickyNavDropdownDefault'));

const StickyNavDropdownOptionsOnly = dynamic(() => import('./StickyNavDropdownOptionsOnly'));

const StickyNavDropdownWithCategories = dynamic(() => import('./StickyNavDropdownWithCategories'));

const StickyNavDropdownWithoutSubCategories = dynamic(
  () => import('./StickyNavDropdownWithoutSubCategories'),
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
  if (catalogueNavLayout === NAV_DROPDOWN_LAYOUT_WITHOUT_SUBCATEGORIES) {
    dropDownLayout = <StickyNavDropdownWithoutSubCategories {...props} />;
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

const links = getProjectLinks();

const StickyNavItem: React.FC<StickyNavItemInterface> = ({
  rubric,
  attributeStyle,
  linkStyle,
  attributeLinkStyle,
  dropdownStyle,
  categories,
  currentRubricSlug,
}) => {
  const { configs } = useConfigContext();
  const { asPath } = useRouter();
  const { name, slug, attributes } = rubric;
  const [isDropdownVisible, setIsDropdownVisible] = React.useState<boolean>(true);

  const hideDropdown = React.useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  // Get rubric slug from product card path
  const path = `${links.catalogue.url}/${slug}`;
  const reg = RegExp(`${path}`);
  const isCurrent = reg.test(asPath) || slug === currentRubricSlug;
  const renderCategoriesAsNavItem =
    configs.categoriesAsNavItems.includes(`${rubric._id}`) && categories.length > 0;

  if (renderCategoriesAsNavItem) {
    return (
      <React.Fragment>
        {categories.map(({ _id, slug, categories, name }) => {
          const categoryNavSlug = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${slug}`;
          const href = `${path}/${categoryNavSlug}`;
          const isCurrent = asPath.indexOf(categoryNavSlug) > -1;

          return (
            <li
              key={`${_id}`}
              className='group px-4 first:pl-0 last:pr-0'
              data-cy={`main-rubric-list-item-${rubric.slug}-${slug}`}
              onMouseLeave={() => setIsDropdownVisible(true)}
            >
              <WpLink
                href={href}
                style={linkStyle}
                testId={`main-rubric-${rubric.slug}`}
                onClick={hideDropdown}
                className='relative flex h-[2.5rem] items-center pt-[2px] font-medium uppercase text-primary-text hover:text-theme hover:no-underline'
              >
                {name}
                {isCurrent ? (
                  <span className='absolute inset-x-0 bottom-0 h-[2px] w-full bg-theme' />
                ) : null}
              </WpLink>

              {isDropdownVisible ? (
                <StickyNavDropdown
                  hideDropdown={hideDropdown}
                  categories={categories || []}
                  attributeLinkStyle={attributeLinkStyle}
                  attributeStyle={attributeStyle}
                  dropdownStyle={dropdownStyle}
                  parentHref={href}
                  attributes={attributes}
                  navCategoryColumns={rubric.variant?.navCategoryColumns || 4}
                  catalogueNavLayout={`${rubric.variant?.catalogueNavLayout}`}
                />
              ) : null}
            </li>
          );
        })}
      </React.Fragment>
    );
  }

  return (
    <li
      className='group px-4 first:pl-0 last:pr-0'
      data-cy={`main-rubric-list-item-${rubric.slug}`}
      onMouseLeave={() => setIsDropdownVisible(true)}
    >
      <WpLink
        href={path}
        style={linkStyle}
        testId={`main-rubric-${rubric.slug}`}
        onClick={hideDropdown}
        className='relative flex h-[2.5rem] items-center pt-[2px] font-medium uppercase text-primary-text hover:text-theme hover:no-underline'
      >
        {name}
        {isCurrent ? (
          <span className='absolute inset-x-0 bottom-0 h-[2px] w-full bg-theme' />
        ) : null}
      </WpLink>

      {isDropdownVisible ? (
        <StickyNavDropdown
          hideDropdown={hideDropdown}
          categories={categories}
          attributeLinkStyle={attributeLinkStyle}
          attributeStyle={attributeStyle}
          dropdownStyle={dropdownStyle}
          parentHref={path}
          attributes={attributes}
          navCategoryColumns={rubric.variant?.navCategoryColumns || 4}
          catalogueNavLayout={`${rubric.variant?.catalogueNavLayout}`}
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
      className='sticky -top-1 left-0 z-[70] hidden w-full bg-secondary shadow-lg lg:block'
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
