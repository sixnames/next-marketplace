import Link from 'components/Link/Link';
import { FILTER_CATEGORY_KEY, FILTER_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { useConfigContext } from 'context/configContext';
import {
  StickyNavAttributeInterface,
  StickyNavCategoryInterface,
  StickyNavDropdownInterface,
} from 'layout/header/StickyNav';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  rubricSlug,
  attributeStyle,
  attributeLinkStyle,
  hideDropdown,
  urlPrefix,
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
              <Link
                onClick={hideDropdown}
                style={attributeLinkStyle}
                testId={`header-nav-dropdown-option`}
                prefetch={false}
                href={`${urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                className='flex items-center py-1 text-secondary-text'
              >
                {option.name}
                {postfix}
              </Link>
            </li>
          );
        })}

        {showOptionsMoreLink ? (
          <li>
            <div
              className='flex items-center py-1 text-theme cursor-pointer hover:underline'
              onClick={() => {
                router
                  .push(`${urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}`)
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
  rubricSlug,
  attributeStyle,
  attributeLinkStyle,
  hideDropdown,
  urlPrefix,
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
        <Link
          onClick={hideDropdown}
          style={attributeStyle}
          testId={`header-nav-dropdown-option`}
          prefetch={false}
          href={`${urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}/${categoryPath}`}
          className='flex items-center gap-3 leading-snug text-secondary-text text-lg font-medium'
        >
          <span>{name}</span>
        </Link>
      </div>
      <ul className='flex-grow flex flex-col'>
        {(categories || []).map((childCategory, index) => {
          const childCategoryPath = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${childCategory.slug}`;
          if (index < stickyNavVisibleSubCategoriesCount) {
            return (
              <li key={`${childCategory._id}`}>
                <Link
                  onClick={hideDropdown}
                  style={attributeLinkStyle}
                  testId={`header-nav-dropdown-option`}
                  prefetch={false}
                  href={`${urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}/${categoryPath}/${childCategoryPath}`}
                  className='flex items-center py-1 text-secondary-text'
                >
                  {childCategory.name}
                </Link>
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
                  .push(`${urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}/${categoryPath}`)
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
  rubricSlug,
  categories,
  hideDropdown,
  urlPrefix,
}) => {
  return (
    <div className='grid grid-cols-6'>
      <div className='col-span-4 border-r border-border-300 pr-8'>
        <div className='grid gap-x-4 gap-y-8 grid-cols-4 '>
          {(categories || []).map((category) => {
            return (
              <StickyNavCategory
                hideDropdown={hideDropdown}
                key={`${category._id}`}
                category={category}
                rubricSlug={rubricSlug}
                attributeStyle={attributeStyle}
                attributeLinkStyle={attributeLinkStyle}
                urlPrefix={urlPrefix}
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
              rubricSlug={rubricSlug}
              attributeStyle={attributeStyle}
              attributeLinkStyle={attributeLinkStyle}
              urlPrefix={urlPrefix}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StickyNavDropdownWithCategories;
