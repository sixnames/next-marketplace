import Breadcrumbs from 'components/Breadcrumbs';
import { CatalogueHeadDefaultInterface } from 'components/Catalogue';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import TextSeoInfo from 'components/TextSeoInfo';
import Title from 'components/Title';
import { FILTER_CATEGORY_KEY, FILTER_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { useSiteContext } from 'context/siteContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { sortStringArray } from 'lib/stringUtils';
import { useRouter } from 'next/router';
import * as React from 'react';

const minCategoriesCount = 1;

const CatalogueHeadWithCategories: React.FC<CatalogueHeadDefaultInterface> = ({
  catalogueCounterString,
  seoTextClassName,
  seoTop,
  catalogueTitle,
  textTop,
  breadcrumbs,
  headCategories,
}) => {
  const { query } = useRouter();
  const { urlPrefix } = useSiteContext();
  const sessionUser = useSiteUserContext();

  return (
    <div className='mb-16'>
      <Breadcrumbs lowBottom config={breadcrumbs} urlPrefix={urlPrefix} />
      <Inner lowBottom lowTop>
        <Title
          centered
          testId={'catalogue-title'}
          subtitle={<div className='lg:hidden text-center'>{catalogueCounterString}</div>}
        >
          {catalogueTitle}
        </Title>

        {headCategories && headCategories.length > minCategoriesCount ? (
          <div className='flex flex-wrap justify-center gap-8 mt-8 mb-8'>
            {headCategories.map(({ _id, icon, name, slug }) => {
              const companySlug = alwaysString(query.companySlug);
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

              const href = `/${companySlug}${ROUTE_CATALOGUE}/${rubricSlug}/${newPathString}`;

              return (
                <Link
                  className='flex flex-col text-secondary-text items-center gap-2 max-w-[160px] hover:no-underline hover:text-theme'
                  href={href}
                  key={`${_id}`}
                >
                  {icon ? (
                    <span
                      className='block catalogue__head-icon text-theme'
                      dangerouslySetInnerHTML={{ __html: icon?.icon }}
                    />
                  ) : null}
                  <span className='block text-center'>{name}</span>
                </Link>
              );
            })}
          </div>
        ) : null}

        {textTop ? (
          <div>
            <div className={`${seoTextClassName} text-center`}>{textTop}</div>
            {sessionUser?.showAdminUiInCatalogue && seoTop ? (
              <div className='space-y-3 mt-6'>
                {(seoTop.locales || []).map((seoLocale: TextUniquenessApiParsedResponseModel) => {
                  return (
                    <TextSeoInfo
                      showLocaleName
                      listClassName='flex gap-3 flex-wrap'
                      key={seoLocale.locale}
                      seoLocale={seoLocale}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </Inner>
    </div>
  );
};

export default CatalogueHeadWithCategories;
