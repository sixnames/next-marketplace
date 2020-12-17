import React from 'react';
import ReactPaginate from 'react-paginate';
import Icon from '../Icon/Icon';
import classes from './Pager.module.css';

interface PagerInterface {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const Pager: React.FC<PagerInterface> = ({ page, totalPages, setPage }) => {
  const pageStep = 1;
  const marginPagesDisplayed = 2;

  if (totalPages < 2) {
    return null;
  }

  return (
    <div className={classes.frame}>
      <ReactPaginate
        pageCount={totalPages}
        initialPage={page - pageStep}
        pageRangeDisplayed={pageStep}
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
        onPageChange={(currentPage) => {
          setPage(currentPage.selected + pageStep);
        }}
      />
    </div>
  );
};

export default Pager;
