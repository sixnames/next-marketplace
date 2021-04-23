import { ROUTE_CATALOGUE } from 'config/common';
import { RubricAttributeInterface, RubricInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Inner from 'components/Inner/Inner';
import { useSiteContext } from 'context/siteContext';
import { useRouter } from 'next/router';
import Link from 'components/Link/Link';
import { alwaysArray } from 'lib/arrayUtils';

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
  const { _id, options, name, metric } = attribute;
  const postfix = metric ? ` ${metric.name}` : null;

  if ((options || []).length < 1) {
    return null;
  }

  return (
    <div key={`${_id}`}>
      <div className='flex items-center min-h-[var(--minLinkHeight)] uppercase font-medium'>
        {name}
      </div>
      <ul>
        {(options || []).map((option) => {
          return (
            <li key={`${option._id}`}>
              <Link
                prefetch={false}
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/${option.slug}`}
                onClick={hideDropdownHandler}
                className='flex items-center min-h-[var(--minLinkHeight)] text-secondary-text hover:no-underline hover:text-theme'
              >
                {option.name}
                {postfix}
              </Link>
            </li>
          );
        })}

        <li>
          <Link
            prefetch={false}
            href={`${ROUTE_CATALOGUE}/${rubricSlug}`}
            onClick={hideDropdownHandler}
            className='flex items-center min-h-[var(--minLinkHeight)] text-secondary-theme'
          >
            Показать все
          </Link>
        </li>
      </ul>
    </div>
  );
};

interface StickyNavItemInterface {
  rubric: RubricInterface;
}

const StickyNavItem: React.FC<StickyNavItemInterface> = ({ rubric }) => {
  const { query } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  const { catalogue = [], card = [] } = query;
  const realCatalogueQuery = alwaysArray(catalogue);
  const catalogueSlug = realCatalogueQuery[0];
  const { name, slug, navItems } = rubric;

  // Get rubric slug from product card path
  const cardSlugs: string[] = alwaysArray(card).slice(0, card.length - 1);
  const cardSlugsParts = cardSlugs.map((slug) => {
    return slug.split('-');
  });
  const rubricSlugArr = cardSlugsParts.find((part) => part[0] === 'rubric');
  const rubricSlug = rubricSlugArr ? rubricSlugArr[1] : '';
  const isCurrent = slug === catalogueSlug || rubricSlug === rubric.slug;

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
        prefetch={false}
        href={`${ROUTE_CATALOGUE}/${slug}`}
        onClick={hideDropdownHandler}
        testId={`main-rubric-${name}`}
        className='relative flex items-center min-h-[var(--minLinkHeight)] uppercase font-medium text-primary-text hover:no-underline hover:text-theme'
      >
        {name}
        {isCurrent ? (
          <span className='absolute bottom-0 inset-x-0 w-full h-[2px] bg-theme' />
        ) : null}
      </Link>

      <div
        className={`absolute top-full w-full inset-x-0 bg-primary-background shadow-lg ${
          isDropdownOpen ? '' : 'h-[1px] overflow-hidden header-hidden-dropdown'
        }`}
      >
        <Inner>
          <div className='grid gap-4 pb-10 grid-cols-8'>
            <div className='grid gap-4 grid-cols-4 col-span-5'>
              {(navItems || []).map((attribute) => {
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
    </li>
  );
};

const StickyNav: React.FC = () => {
  const { navRubrics } = useSiteContext();

  return (
    <nav className='hidden sticky -top-1 left-0 z-[70] w-full shadow-lg bg-secondary-background wp-desktop:block'>
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
