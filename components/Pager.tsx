import { useRouter } from 'next/router';
import * as React from 'react';
import { usePagination } from '@material-ui/lab/Pagination';
import { FILTER_PAGE_KEY, FILTER_SEPARATOR } from '../config/common';
import { alwaysString } from '../lib/arrayUtils';
import { noNaN } from '../lib/numbers';
import WpButton from './button/WpButton';
import WpLink from './Link/WpLink';
import WpIcon from './WpIcon';

const minimalPagesCount = 2;
const siblingCount = 7;
const buttonClassName =
  'flex items-center justify-center w-10 h-10 text-primary-text hover:text-theme hover:no-underline';
const iconClassName = 'w-4 h-4';

interface PagerInterface {
  page: number;
  totalPages?: number;
  setPage?: (page: number) => void;
  className?: string;
  showMoreHandler?: (nextPath: string, page: number) => void;
  isLoading?: boolean;
}

function getNextPageParam(page: number): string {
  if (page === 1) {
    return '';
  }
  return `${FILTER_PAGE_KEY}${FILTER_SEPARATOR}${page}`;
}

function getNextPath(prevUrlArray: string[], page: number, search?: string | string[]): string {
  const pageParam = getNextPageParam(page);
  const searchString = alwaysString(search);
  const nextUrlArray = [...prevUrlArray, pageParam].join('/');
  const nextUrl = `/${nextUrlArray}${
    searchString && searchString.length > 0 ? `?search=${searchString}` : ''
  }`;
  return nextUrl;
}

const Pager: React.FC<PagerInterface> = ({
  page,
  showMoreHandler,
  totalPages,
  setPage,
  className,
  isLoading,
}) => {
  const { query, asPath } = useRouter();
  const { items } = usePagination({
    siblingCount,
    count: totalPages,
    page,
  });

  if (noNaN(totalPages) < minimalPagesCount) {
    return null;
  }

  const prevUrlArray = asPath.split('/').filter((param) => {
    const paramParts = param.split(FILTER_SEPARATOR);
    return paramParts[0] !== FILTER_PAGE_KEY;
  });

  return (
    <div className={`${className ? className : 'pt-6 pb-16'}`}>
      <div className={`flex flex-wrap justify-center items-center`}>
        {items.map(({ page, type, selected, disabled }, index) => {
          let children;
          const arrowClassName = `${disabled ? 'pointer-events-none opacity-50' : ''}`;
          const initialNextUrl = getNextPath(prevUrlArray, page, query.search);
          const nextUrl = initialNextUrl;

          const onClick = (e: any) => {
            if (setPage) {
              e.preventDefault();
              setPage(page);
            }
          };

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = '…';
          } else if (type === 'page') {
            children = (
              <WpLink
                onClick={onClick}
                className={`flex items-center justify-center w-10 h-10 hover:no-underline ${
                  selected
                    ? ' pointer-events-none font-bold text-theme'
                    : 'text-primary-text hover:text-theme'
                }`}
                href={nextUrl}
              >
                {page}
              </WpLink>
            );
          } else if (type === 'previous') {
            if (disabled) {
              children = (
                <span className={`${buttonClassName} ${arrowClassName}`}>
                  <WpIcon className={iconClassName} name={'chevron-left'} />
                </span>
              );
            } else {
              children = (
                <WpLink
                  ariaLabel={'Go to previous page'}
                  onClick={onClick}
                  className={`${buttonClassName} ${arrowClassName}`}
                  href={nextUrl}
                >
                  <WpIcon className={iconClassName} name={'chevron-left'} />
                </WpLink>
              );
            }
          } else {
            if (disabled) {
              children = (
                <span className={`${buttonClassName} ${arrowClassName}`}>
                  <WpIcon className={iconClassName} name={'chevron-right'} />
                </span>
              );
            } else {
              children = (
                <WpLink
                  ariaLabel={'Go to next page'}
                  onClick={onClick}
                  className={`${buttonClassName} ${arrowClassName}`}
                  href={nextUrl}
                >
                  <WpIcon className={iconClassName} name={'chevron-right'} />
                </WpLink>
              );
            }
          }

          return <div key={index}>{children}</div>;
        })}
      </div>

      {showMoreHandler && noNaN(totalPages) > page ? (
        <div className='flex justify-center mt-6'>
          <WpButton
            isLoading={isLoading}
            size={'small'}
            onClick={() => {
              const nextPage = page + 1;
              const nextUrl = getNextPath(prevUrlArray, nextPage, query.search);
              showMoreHandler(nextUrl, nextPage);
            }}
          >
            Показать ещё
          </WpButton>
        </div>
      ) : null}
    </div>
  );
};

export default Pager;
