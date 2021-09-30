import { FILTER_SEPARATOR, QUERY_FILTER_PAGE } from 'config/common';
import { useRouter } from 'next/router';
import * as React from 'react';
import ReactPaginate from 'react-paginate';
import Icon from 'components/Icon';
import classes from './Pager.module.css';

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
    <div className={classes.frame}>
      <ReactPaginate
        pageCount={totalPages}
        initialPage={page - pageStep}
        forcePage={page - pageStep}
        pageRangeDisplayed={1}
        marginPagesDisplayed={marginPagesDisplayed}
        previousLabel={<Icon name={'chevron-left'} />}
        previousClassName={classes.prev}
        previousLinkClassName={classes.butn}
        nextLabel={<Icon name={'chevron-right'} />}
        nextLinkClassName={classes.butn}
        nextClassName={classes.next}
        pageLinkClassName={classes.butn}
        breakLinkClassName={classes.butn}
        containerClassName={classes.container}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Pager;
