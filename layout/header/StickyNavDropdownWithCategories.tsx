import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { CATALOGUE_CATEGORY_KEY, FILTER_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { useConfigContext } from 'context/configContext';
import {
  dropdownClassName,
  StickyNavAttributeInterface,
  StickyNavCategoryInterface,
  StickyNavDropdownInterface,
} from 'layout/header/StickyNav';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  rubricSlug,
  attributeStyle,
  attributeLinkStyle,
  hideDropdown,
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
      <div style={attributeStyle} className='flex items-center pb-1 uppercase font-medium'>
        {name}
      </div>
      <ul className='flex-grow flex flex-col'>
        {(options || []).map((option) => {
          return (
            <li key={`${option._id}`}>
              <Link
                onClick={hideDropdown}
                style={attributeLinkStyle}
                testId={`header-nav-dropdown-option`}
                prefetch={false}
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                className='flex items-center py-1 text-secondary-text'
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
              onClick={hideDropdown}
              prefetch={false}
              href={`${ROUTE_CATALOGUE}/${rubricSlug}`}
              className='flex items-center py-1 text-secondary-theme'
            >
              Показать все
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

const StickyNavCategory: React.FC<StickyNavCategoryInterface> = ({
  category,
  rubricSlug,
  attributeStyle,
  attributeLinkStyle,
  hideDropdown,
}) => {
  const { categories, name, icon } = category;
  const categoryPath = `${CATALOGUE_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`;
  return (
    <div className='flex flex-col'>
      <div style={attributeStyle} className='flex items-center pb-1 font-medium'>
        <Link
          onClick={hideDropdown}
          style={attributeLinkStyle}
          testId={`header-nav-dropdown-option`}
          prefetch={false}
          href={`${ROUTE_CATALOGUE}/${rubricSlug}/${categoryPath}`}
          className='flex items-center gap-3 py-2 text-secondary-text text-lg'
        >
          {icon ? (
            <span
              className='flex-shrink-0 header-dropdown-category-icon'
              dangerouslySetInnerHTML={{ __html: icon.icon }}
            />
          ) : null}
          <span>{name}</span>
        </Link>
      </div>
      <ul className='flex-grow flex flex-col'>
        {(categories || []).map((childCategory) => {
          const childCategoryPath = `${CATALOGUE_CATEGORY_KEY}${FILTER_SEPARATOR}${childCategory.slug}`;
          return (
            <li key={`${childCategory._id}`}>
              <Link
                onClick={hideDropdown}
                style={attributeLinkStyle}
                testId={`header-nav-dropdown-option`}
                prefetch={false}
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/${categoryPath}/${childCategoryPath}`}
                className='flex items-center py-1 text-secondary-text'
              >
                {childCategory.name}
              </Link>
            </li>
          );
        })}
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
  hideDropdown,
}) => {
  return (
    <div style={dropdownStyle} data-cy={'header-nav-dropdown'} className={dropdownClassName}>
      <Inner>
        <div className='grid grid-cols-6'>
          <div className='grid gap-x-4 gap-y-8 grid-cols-4 col-span-4 border-r border-border-300 pr-8'>
            {(categories || []).map((category) => {
              return (
                <StickyNavCategory
                  hideDropdown={hideDropdown}
                  key={`${category._id}`}
                  category={category}
                  rubricSlug={rubricSlug}
                  attributeStyle={attributeStyle}
                  attributeLinkStyle={attributeLinkStyle}
                />
              );
            })}
          </div>
          <div className='grid gap-x-4 gap-y-8 grid-cols-2 pl-8 col-span-2'>
            {(attributes || []).map((attribute) => {
              return (
                <StickyNavAttribute
                  hideDropdown={hideDropdown}
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
};

export default StickyNavDropdownWithCategories;
