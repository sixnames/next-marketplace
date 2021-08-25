import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { StickyNavAttributeInterface, StickyNavDropdownInterface } from 'layout/header/StickyNav';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  rubricSlug,
  attributeStyle,
  attributeLinkStyle,
}) => {
  const { configs } = useConfigContext();
  const { options, name, metric } = attribute;
  const postfix = metric ? ` ${metric.name}` : null;
  const visibleOptionsCount = configs.stickyNavVisibleOptionsCount;
  const showOptionsMoreLink = noNaN(visibleOptionsCount) === attribute.options?.length;

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
                style={attributeLinkStyle}
                testId={`header-nav-dropdown-option`}
                prefetch={false}
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
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

const StickyNavDropdownWithCategories: React.FC<StickyNavDropdownInterface> = ({
  attributes,
  attributeStyle,
  attributeLinkStyle,
  dropdownStyle,
  rubricSlug,
  categories,
}) => {
  if (!attributes || attributes.length < 1) {
    return null;
  }

  if (categories.length > 0) {
    return (
      <div
        style={dropdownStyle}
        data-cy={'header-nav-dropdown'}
        className={`wp-nav-dropdown-hidden group-hover:wp-nav-dropdown-visible bg-secondary shadow-lg`}
      >
        <Inner>
          <div className='grid grid-cols-2'>
            <div></div>
            <div className='grid gap-4 grid-cols-2'>
              {(attributes || []).map((attribute) => {
                return (
                  <StickyNavAttribute
                    key={`${attribute._id}`}
                    attribute={attribute}
                    rubricSlug={rubricSlug}
                    attributeStyle={attributeStyle}
                    attributeLinkStyle={attributeLinkStyle}
                  />
                );
              })}
            </div>
          </div>
        </Inner>
      </div>
    );
  }

  return (
    <div
      style={dropdownStyle}
      data-cy={'header-nav-dropdown'}
      className={`wp-nav-dropdown-hidden group-hover:wp-nav-dropdown-visible bg-secondary shadow-lg`}
    >
      <Inner>
        <div className='grid gap-4 grid-cols-5'>
          {(attributes || []).map((attribute) => {
            return (
              <StickyNavAttribute
                key={`${attribute._id}`}
                attribute={attribute}
                rubricSlug={rubricSlug}
                attributeStyle={attributeStyle}
                attributeLinkStyle={attributeLinkStyle}
              />
            );
          })}
        </div>
      </Inner>
    </div>
  );
};

export default StickyNavDropdownWithCategories;
