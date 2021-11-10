import Link from 'components/Link/Link';
import { FILTER_SEPARATOR, FILTER_PAGE_KEY } from 'config/common';
import { useRouter } from 'next/router';
import * as React from 'react';
import Icon from 'components/Icon';
import { usePagination } from '@material-ui/lab/Pagination';

const minimalPagesCount = 2;
const siblingCount = 7;
const buttonClassName =
  'flex items-center justify-center w-10 h-10 text-primary-text hover:text-theme hover:no-underline';
const iconClassName = 'w-4 h-4';

interface PagerInterface {
  page: number;
  totalPages: number;
  setPage?: (page: number) => void;
}

const Pager: React.FC<PagerInterface> = ({ page, totalPages, setPage }) => {
  const { asPath, query } = useRouter();
  const { items } = usePagination({
    siblingCount,
    count: totalPages,
    page,
  });

  if (totalPages < minimalPagesCount) {
    return null;
  }

  const prevUrlArray = asPath.split('/').filter((param) => {
    if (!param) {
      return false;
    }
    const paramParts = param.split(FILTER_SEPARATOR);
    return paramParts[0] !== FILTER_PAGE_KEY;
  });

  return (
    <div className='pt-6 pb-16 flex flex-wrap justify-center items-center'>
      {items.map(({ page, type, selected, disabled }, index) => {
        let children;
        const arrowClassName = `${disabled ? 'pointer-events-none opacity-50' : ''}`;
        const selectedClassName = `${selected ? ' pointer-events-none font-bold text-theme' : ''}`;
        const pageParam = `${FILTER_PAGE_KEY}${FILTER_SEPARATOR}${page}`;
        const nextUrlArray = [...prevUrlArray, pageParam].join('/');
        const nextUrl = `/${nextUrlArray}${
          query.search && query.search.length > 0 ? `?search=${query.search}` : '/'
        }`;

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
            <Link
              onClick={onClick}
              className={`${buttonClassName} ${selectedClassName}`}
              href={nextUrl}
            >
              {page}
            </Link>
          );
        } else if (type === 'previous') {
          children = (
            <Link
              onClick={onClick}
              className={`${buttonClassName} ${arrowClassName}`}
              href={nextUrl}
            >
              <Icon className={iconClassName} name={'chevron-left'} />
            </Link>
          );
        } else {
          children = (
            <Link
              onClick={onClick}
              className={`${buttonClassName} ${arrowClassName}`}
              href={nextUrl}
            >
              <Icon className={iconClassName} name={'chevron-right'} />
            </Link>
          );
        }

        return <div key={index}>{children}</div>;
      })}
    </div>
  );
};

export default Pager;
