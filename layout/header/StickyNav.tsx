import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import { RubricAttributeInterface, RubricInterface } from 'db/uiInterfaces';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import Inner from 'components/Inner';
import { useSiteContext } from 'context/siteContext';
import { useRouter } from 'next/router';
import Link from 'components/Link/Link';

export interface StickyNavAttributeInterface {
  attribute: RubricAttributeInterface;
  hideDropdownHandler: () => void;
  rubricSlug: string;
}

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  hideDropdownHandler,
  rubricSlug,
}) => {
  const { isDark } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const { options, name, metric } = attribute;
  const postfix = metric ? ` ${metric.name}` : null;
  const visibleOptionsCount = getSiteConfigSingleValue('stickyNavVisibleOptionsCount');
  const showOptionsMoreLink = noNaN(visibleOptionsCount) === attribute.options?.length;

  // styles
  const linkColorLightTheme = getSiteConfigSingleValue('siteNavDropdownTextLightTheme');
  const linkColorDarkTheme = getSiteConfigSingleValue('siteNavDropdownTextDarkTheme');
  const attributeColorLightTheme = getSiteConfigSingleValue('siteNavDropdownAttributeLightTheme');
  const attributeColorDarkTheme = getSiteConfigSingleValue('siteNavDropdownAttributeDarkTheme');

  const linkStyle = {
    color: (isDark ? linkColorDarkTheme : linkColorLightTheme) || 'var(--textSecondaryColor)',
  } as React.CSSProperties;

  const attributeStyle = {
    color: (isDark ? attributeColorDarkTheme : attributeColorLightTheme) || 'var(--textColor)',
  } as React.CSSProperties;

  if ((options || []).length < 1) {
    return null;
  }

  return (
    <div className='flex flex-col'>
      <div
        style={attributeStyle}
        className='flex items-center min-h-[var(--minLinkHeight)] uppercase font-medium'
      >
        {name}
      </div>
      <ul className='flex-grow flex flex-col'>
        {(options || []).map((option) => {
          return (
            <li key={`${option._id}`}>
              <Link
                style={linkStyle}
                testId={`header-nav-dropdown-option`}
                prefetch={false}
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
                onClick={hideDropdownHandler}
                className='flex items-center min-h-[var(--minLinkHeight)] text-secondary-text'
              >
                {option.name}
                {postfix}
              </Link>
            </li>
          );
        })}

        {showOptionsMoreLink ? (
          <li className='mt-auto'>
            <Link
              prefetch={false}
              href={`${ROUTE_CATALOGUE}/${rubricSlug}`}
              onClick={hideDropdownHandler}
              className='flex items-center min-h-[var(--minLinkHeight)] text-secondary-theme'
            >
              Показать все
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

interface StickyNavItemInterface {
  rubric: RubricInterface;
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({ rubric }) => {
  const { asPath } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  const { name, slug, attributes } = rubric;
  const { isDark } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const textColorLightTheme = getSiteConfigSingleValue('siteNavBarTextLightTheme');
  const textColorDarkTheme = getSiteConfigSingleValue('siteNavBarTextDarkTheme');
  const dropDownBgLightTheme = getSiteConfigSingleValue('siteNavDropdownBgLightTheme');
  const dropDownBgDarkTheme = getSiteConfigSingleValue('siteNavDropdownBgDarkTheme');

  // styles
  const linkStyle = {
    color: (isDark ? textColorDarkTheme : textColorLightTheme) || 'var(--textColor)',
  } as React.CSSProperties;

  const dropdownStyle = {
    backgroundColor:
      (isDark ? dropDownBgDarkTheme : dropDownBgLightTheme) || 'var(--secondaryBackground)',
  } as React.CSSProperties;

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

      {attributes && attributes.length > 0 ? (
        <div
          style={dropdownStyle}
          data-cy={'header-nav-dropdown'}
          className={`absolute top-full w-full inset-x-0 bg-secondary shadow-lg ${
            isDropdownOpen ? '' : 'h-[1px] overflow-hidden header-hidden-dropdown'
          }`}
        >
          <Inner>
            <div className='grid gap-4 pb-10 grid-cols-8'>
              <div className='grid gap-4 grid-cols-4 col-span-5'>
                {(attributes || []).map((attribute) => {
                  return (
                    <StickyNavAttribute
                      key={`${attribute._id}`}
                      attribute={attribute}
                      hideDropdownHandler={hideDropdownHandler}
                      rubricSlug={slug}
                    />
                  );
                })}
              </div>
              <div className='col-span-3' />
            </div>
          </Inner>
        </div>
      ) : null}
    </li>
  );
};

const StickyNav: React.FC = () => {
  const { navRubrics } = useSiteContext();
  const { isDark } = useThemeContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const bgColorLightTheme = getSiteConfigSingleValue('siteNavBarBgLightTheme');
  const bgColorDarkTheme = getSiteConfigSingleValue('siteNavBarBgDarkTheme');

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
            return <StickyNavItem rubric={rubric} key={`${rubric._id}`} />;
          })}
        </ul>
      </Inner>
    </nav>
  );
};

export default StickyNav;
