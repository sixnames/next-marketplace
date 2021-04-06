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
        onPageChange={(selectedItem) => {
          setPage(selectedItem.selected + pageStep);
        }}
      />
    </div>
  );
};

export default Pager;
