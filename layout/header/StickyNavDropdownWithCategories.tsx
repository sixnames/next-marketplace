import { useRouter } from 'next/router';
import * as React from 'react';
import WpLink from '../../components/Link/WpLink';
import { FILTER_CATEGORY_KEY, FILTER_SEPARATOR } from '../../config/common';
import { useConfigContext } from '../../context/configContext';
import { noNaN } from '../../lib/numbers';
import {
  StickyNavAttributeInterface,
  StickyNavCategoryInterface,
  StickyNavDropdownInterface,
} from './StickyNav';

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  attributeStyle,
  attributeLinkStyle,
  hideDropdown,
  parentHref,
}) => {
  const router = useRouter();
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
        className='flex items-center pb-1 text-secondary-text text-lg font-medium'
      >
        {name}
      </div>
      <ul className='flex-grow flex flex-col'>
        {(options || []).map((option) => {
          return (
            <li key={`${option._id}`}>
              <WpLink
                onClick={hideDropdown}
                style={attributeLinkStyle}
                testId={`header-nav-dropdown-option`}
                prefetch={false}
                href={`${parentHref}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                className='flex items-center py-1 text-secondary-text'
              >
                {option.name}
                {postfix}
              </WpLink>
            </li>
          );
        })}

        {showOptionsMoreLink ? (
          <li>
            <div
              className='flex items-center py-1 text-theme cursor-pointer hover:underline'
              onClick={() => {
                router
                  .push(parentHref)
                  .then(() => {
                    if (hideDropdown) {
                      hideDropdown();
                    }
                  })
                  .catch(console.log);
              }}
            >
              Показать все
            </div>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

const StickyNavCategory: React.FC<StickyNavCategoryInterface> = ({
  category,
  attributeStyle,
  attributeLinkStyle,
  hideDropdown,
  parentHref,
}) => {
  const router = useRouter();
  const { configs } = useConfigContext();
  const { categories, name } = category;
  const categoryPath = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`;
  const stickyNavVisibleSubCategoriesCount = configs.stickyNavVisibleSubCategoriesCount;
  const showOptionsMoreLink =
    noNaN(stickyNavVisibleSubCategoriesCount) <= noNaN(categories?.length);

  return (
    <div className='flex flex-col'>
      <div className='flex items-center pb-1 font-medium'>
        <WpLink
          onClick={hideDropdown}
          style={attributeStyle}
          testId={`header-nav-dropdown-option`}
          prefetch={false}
          href={`${parentHref}/${categoryPath}`}
          className='flex items-center gap-3 leading-snug text-secondary-text text-lg font-medium'
        >
          <span>{name}</span>
        </WpLink>
      </div>
      <ul className='flex-grow flex flex-col'>
        {(categories || []).map((childCategory, index) => {
          const childCategoryPath = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${childCategory.slug}`;
          if (index < stickyNavVisibleSubCategoriesCount) {
            return (
              <li key={`${childCategory._id}`}>
                <WpLink
                  onClick={hideDropdown}
                  style={attributeLinkStyle}
                  testId={`header-nav-dropdown-option`}
                  prefetch={false}
                  href={`${parentHref}/${categoryPath}/${childCategoryPath}`}
                  className='flex items-center py-1 text-secondary-text'
                >
                  {childCategory.name}
                </WpLink>
              </li>
            );
          }
          return null;
        })}
        {showOptionsMoreLink ? (
          <li>
            <div
              className='flex items-center py-1 text-theme cursor-pointer hover:underline'
              onClick={() => {
                router
                  .push(`${parentHref}/${categoryPath}`)
                  .then(() => {
                    if (hideDropdown) {
                      hideDropdown();
                    }
                  })
                  .catch(console.log);
              }}
            >
              Показать все
            </div>
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

  categories,
  hideDropdown,
  navCategoryColumns,
  parentHref,
}) => {
  let categoryColumnsClassName = 'grid-cols-4';
  if (navCategoryColumns === 3) {
    categoryColumnsClassName = 'grid-cols-3';
  }
  if (navCategoryColumns === 2) {
    categoryColumnsClassName = 'grid-cols-2';
  }
  if (navCategoryColumns === 1) {
    categoryColumnsClassName = 'grid-cols-1';
  }

  return (
    <div className='grid grid-cols-6'>
      <div className='col-span-4 border-r border-border-300 pr-8'>
        <div className={`grid gap-x-4 gap-y-8 grid-cols-4 ${categoryColumnsClassName}`}>
          {(categories || []).map((category) => {
            return (
              <StickyNavCategory
                hideDropdown={hideDropdown}
                key={`${category._id}`}
                category={category}
                parentHref={parentHref}
                attributeStyle={attributeStyle}
                attributeLinkStyle={attributeLinkStyle}
              />
            );
          })}
        </div>
      </div>
      <div className='grid gap-x-4 gap-y-8 grid-cols-2 pl-8 col-span-2 self-start'>
        {(attributes || []).map((attribute) => {
          return (
            <StickyNavAttribute
              hideDropdown={hideDropdown}
              key={`${attribute._id}`}
              attribute={attribute}
              parentHref={parentHref}
              attributeStyle={attributeStyle}
              attributeLinkStyle={attributeLinkStyle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StickyNavDropdownWithCategories;
