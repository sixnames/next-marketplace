import { FILTER_SEPARATOR, QUERY_FILTER_PAGE } from 'config/common';
import { useRouter } from 'next/router';
import * as React from 'react';
import ReactPaginate from 'react-paginate';
import Icon from 'components/Icon';

interface PagerInterface {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const pageStep = 1;
const minimalPagesCount = 2;
const marginPagesDisplayed = 2;

export const useNavigateToPageHandler = () => {
  const router = useRouter();
  return React.useCallback(
    (newPage: number) => {
      const { asPath, query } = router;
      const pageParam = `${QUERY_FILTER_PAGE}${FILTER_SEPARATOR}${newPage}`;
      const prevUrlArray = asPath.split('/').filter((param) => {
        if (!param) {
          return false;
        }
        const paramParts = param.split(FILTER_SEPARATOR);
        return paramParts[0] !== QUERY_FILTER_PAGE;
      });
      const nextUrl = [...prevUrlArray, pageParam].join('/');
      router
        .push(
          `/${nextUrl}${query.search && query.search.length > 0 ? `?search=${query.search}` : '/'}`,
        )
        .catch((e) => {
          console.log(e);
        });
    },
    [router],
  );
};

const buttonClassName =
  'flex items-center justify-center w-10 h-10 text-primary-text hover:text-theme hover:no-underline';
const iconClassName = 'w-4 h-4';

const Pager: React.FC<PagerInterface> = ({ page, totalPages, setPage }) => {
  const onPageChange = React.useCallback(
    (selectedItem: any) => {
      setPage(selectedItem.selected + pageStep);
    },
    [setPage],
  );

  if (totalPages < minimalPagesCount) {
    return null;
  }

  return (
    <div className='pt-6 pb-16'>
      <ReactPaginate
        pageCount={totalPages}
        initialPage={page - pageStep}
        forcePage={page - pageStep}
        pageRangeDisplayed={1}
        activeLinkClassName={'text-theme'}
        marginPagesDisplayed={marginPagesDisplayed}
        previousLabel={<Icon className={iconClassName} name={'chevron-left'} />}
        previousClassName={'classes.prev'}
        previousLinkClassName={buttonClassName}
        nextLabel={<Icon className={iconClassName} name={'chevron-right'} />}
        nextLinkClassName={buttonClassName}
        nextClassName={'classes.next'}
        pageLinkClassName={buttonClassName}
        breakLinkClassName={buttonClassName}
        containerClassName='flex items-center justify-center gap-2'
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Pager;
