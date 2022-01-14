import { useRouter } from 'next/router';
import * as React from 'react';
import { CatalogueHeadDefaultInterface } from '../../components/Catalogue';
import Inner from '../../components/Inner';
import WpLink from '../../components/Link/WpLink';
import WpBreadcrumbs from '../../components/WpBreadcrumbs';
import WpTitle from '../../components/WpTitle';
import { FILTER_CATEGORY_KEY, FILTER_SEPARATOR, ROUTE_CATALOGUE } from '../../config/common';
import { alwaysArray, alwaysString } from '../../lib/arrayUtils';
import { sortStringArray } from '../../lib/stringUtils';

const minCategoriesCount = 1;

const CatalogueHeadWithCategories: React.FC<CatalogueHeadDefaultInterface> = ({
  catalogueCounterString,
  catalogueTitle,
  breadcrumbs,
  headCategories,
}) => {
  const router = useRouter();
  const { query } = router;
  return (
    <div className='mb-4 border-b border-border-100'>
      <WpBreadcrumbs lowBottom config={breadcrumbs} />
      <Inner lowBottom lowTop>
        <WpTitle
          centered
          testId={'catalogue-title'}
          subtitle={<div className='lg:hidden text-center'>{catalogueCounterString}</div>}
        >
          {catalogueTitle}
        </WpTitle>

        {headCategories && headCategories.length > minCategoriesCount ? (
          <div className='flex flex-wrap justify-between md:justify-center md:gap-x-4 gap-y-8 mt-8 mb-8'>
            {headCategories.map(({ _id, icon, name, slug }) => {
              const rubricSlug = alwaysString(query.rubricSlug);
              const categoryFilter = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${slug}`;

              const otherCategoryFiltersArray = alwaysArray(query.filters).reduce(
                (acc: string[], filter) => {
                  const filterParts = alwaysString(filter).split(FILTER_SEPARATOR);
                  if (filterParts[0] === FILTER_CATEGORY_KEY) {
                    return [...acc, filter];
                  }
                  return acc;
                },
                [],
              );

              const newPathArray = sortStringArray([...otherCategoryFiltersArray, categoryFilter]);
              const newPathString = newPathArray.join('/');

              const href = `${ROUTE_CATALOGUE}/${rubricSlug}/${newPathString}`;

              return (
                <WpLink
                  className='flex flex-col text-secondary-text items-center gap-2 max-w-[140px] min-w-[140px] md:max-w-[160px] md:min-w-[160px] hover:no-underline hover:text-theme'
                  href={href}
                  key={`${_id}`}
                >
                  {icon ? (
                    <span
                      className='block catalogue__head-icon text-theme'
                      dangerouslySetInnerHTML={{ __html: icon?.icon }}
                    />
                  ) : null}
                  <span className='block text-center text-sm md:text-base'>{name}</span>
                </WpLink>
              );
            })}
          </div>
        ) : null}
      </Inner>
    </div>
  );
};

export default CatalogueHeadWithCategories;
