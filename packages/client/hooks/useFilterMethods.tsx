import useRouterQuery from './useRouterQuery';
import { QUERY_FILTER_PAGE } from '../config';
import React from 'react';

function useFilterMethods() {
  const {
    query = {},
    setQuery,
    // toggleQuery,
    // removeQuery
  } = useRouterQuery();
  const currentPage = query[QUERY_FILTER_PAGE];
  const pageNum = currentPage ? +currentPage : 1;

  const nextPage = React.useCallback(() => {
    setQuery({ key: QUERY_FILTER_PAGE, value: `${pageNum + 1}` });
  }, [setQuery, pageNum]);

  const prevPage = React.useCallback(() => {
    setQuery({ key: QUERY_FILTER_PAGE, value: `${pageNum - 1}` });
  }, [setQuery, pageNum]);

  const setPage = React.useCallback(
    (page) => {
      setQuery({ key: QUERY_FILTER_PAGE, value: page });
    },
    [setQuery],
  );

  return {
    setPage,
    nextPage,
    prevPage,
    query,
    [QUERY_FILTER_PAGE]: pageNum,
  };
}

export default useFilterMethods;
