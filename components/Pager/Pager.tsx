import * as React from 'react';
import ReactPaginate from 'react-paginate';
import Icon from '../Icon/Icon';
import classes from './Pager.module.css';

interface PagerInterface {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const pageStep = 1;
const minimalPagesCount = 2;
const marginPagesDisplayed = 2;

const Pager: React.FC<PagerInterface> = ({ page, totalPages, setPage }) => {
  const [pageState, setPageState] = React.useState<number>(() => page);

  const initialPage = React.useMemo(() => {
    return page - pageStep;
  }, [page]);

  React.useEffect(() => {
    if (page !== pageState) {
      setPage(pageState);
    }
  }, [page, pageState, setPage]);

  const onPageChange = React.useCallback((currentPage) => {
    setPageState(currentPage.selected + pageStep);
  }, []);

  if (totalPages < minimalPagesCount) {
    return null;
  }

  return (
    <div className={classes.frame}>
      <ReactPaginate
        pageCount={totalPages}
        initialPage={initialPage}
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
