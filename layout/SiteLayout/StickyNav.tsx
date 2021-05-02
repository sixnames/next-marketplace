import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { RubricAttributeInterface, RubricInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Inner from 'components/Inner/Inner';
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
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
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
  const { asPath } = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  const { name, slug, attributes } = rubric;

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
        onClick={hideDropdownHandler}
        testId={`main-rubric-${name}`}
        activeClassName='text-blue>>>>>>>>>>>>>>>>>>>>>>'
        className='relative flex items-center min-h-[var(--minLinkHeight)] uppercase font-medium text-primary-text hover:no-underline hover:text-theme'
      >
        {name}
        {isCurrent ? (
          <span className='absolute bottom-0 inset-x-0 w-full h-[2px] bg-theme' />
        ) : null}
      </Link>

      <div
        className={`absolute top-full w-full inset-x-0 bg-gray-50 dark:bg-gray-800 shadow-lg ${
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
    </li>
  );
};

const StickyNav: React.FC = () => {
  const { navRubrics } = useSiteContext();

  return (
    <nav className='hidden sticky -top-1 left-0 z-[70] w-full shadow-lg bg-gray-100 dark:bg-gray-800 wp-desktop:block'>
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
