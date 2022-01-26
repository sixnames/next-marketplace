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
        className='flex items-center pb-1 text-lg font-medium text-secondary-text'
      >
        {name}
      </div>
      <ul className='flex flex-grow flex-col'>
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
              className='flex cursor-pointer items-center py-1 text-theme hover:underline'
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
  hideDropdown,
  parentHref,
}) => {
  const { name, icon } = category;
  const categoryPath = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`;

  return (
    <div className='flex flex-col'>
      <div className='flex items-center pb-1'>
        <WpLink
          onClick={hideDropdown}
          style={attributeStyle}
          testId={`header-nav-dropdown-option`}
          prefetch={false}
          href={`${parentHref}/${categoryPath}`}
          className='nav-dropdown-icon-link group flex items-center gap-3 text-lg leading-snug text-secondary-text hover:no-underline'
        >
          {icon ? (
            <span
              className='nav-dropdown-icon text-theme'
              dangerouslySetInnerHTML={{ __html: icon.icon }}
            />
          ) : null}
          <span>{name}</span>
        </WpLink>
      </div>
    </div>
  );
};

const StickyNavDropdownWithoutSubCategories: React.FC<StickyNavDropdownInterface> = ({
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
        <div className={`grid grid-cols-4 gap-x-4 gap-y-8 ${categoryColumnsClassName}`}>
          {(categories || []).map((category) => {
            return (
              <StickyNavCategory
                hideDropdown={hideDropdown}
                key={`${category._id}`}
                category={category}
                attributeStyle={attributeStyle}
                attributeLinkStyle={attributeLinkStyle}
                parentHref={parentHref}
              />
            );
          })}
        </div>
      </div>
      <div className='col-span-2 grid grid-cols-2 gap-x-4 gap-y-8 self-start pl-8'>
        {(attributes || []).map((attribute) => {
          return (
            <StickyNavAttribute
              hideDropdown={hideDropdown}
              key={`${attribute._id}`}
              attribute={attribute}
              attributeStyle={attributeStyle}
              attributeLinkStyle={attributeLinkStyle}
              parentHref={parentHref}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StickyNavDropdownWithoutSubCategories;
