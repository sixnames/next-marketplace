import React from 'react';
import useRouterQuery from './useRouterQuery';
import {
  QUERY_DATA_LAYOUT_FILTER,
  QUERY_DATA_LAYOUT_FILTER_VALUE,
  QUERY_DATA_LAYOUT_PAGE,
  QUERY_DATA_LAYOUT_PREVIEW,
} from '../config';
import { ObjectType } from '../types';

function useDataLayoutMethods() {
  const { query = {}, toggleQuery, setQuery, removeQuery } = useRouterQuery();
  const currentPage = query[QUERY_DATA_LAYOUT_PAGE];
  const pageNum = currentPage ? +currentPage : 1;

  const toggleFilter = React.useCallback(() => {
    toggleQuery({ key: QUERY_DATA_LAYOUT_FILTER, value: QUERY_DATA_LAYOUT_FILTER_VALUE });
  }, [toggleQuery]);

  const setPreviewId = React.useCallback(
    (id) => {
      setQuery({ key: QUERY_DATA_LAYOUT_PREVIEW, value: id });
    },
    [setQuery],
  );

  const removePreviewId = React.useCallback(() => {
    removeQuery({ key: QUERY_DATA_LAYOUT_PREVIEW });
  }, [removeQuery]);

  const setPage = React.useCallback(
    (page) => {
      setQuery({ key: QUERY_DATA_LAYOUT_PAGE, value: page });
    },
    [setQuery],
  );

  const nextPage = React.useCallback(() => {
    setQuery({ key: QUERY_DATA_LAYOUT_PAGE, value: `${pageNum + 1}` });
  }, [setQuery, pageNum]);

  const prevPage = React.useCallback(() => {
    setQuery({ key: QUERY_DATA_LAYOUT_PAGE, value: `${pageNum - 1}` });
  }, [setQuery, pageNum]);

  const contentFilters = Object.keys(query).reduce((acc: ObjectType, key) => {
    if (key === QUERY_DATA_LAYOUT_FILTER || key === QUERY_DATA_LAYOUT_PREVIEW) {
      return acc;
    }
    acc[key] = query[key];
    return acc;
  }, {});

  return {
    toggleFilter,
    setPreviewId,
    removePreviewId,
    setPage,
    nextPage,
    prevPage,
    query,
    contentFilters,
    [QUERY_DATA_LAYOUT_PAGE]: pageNum,
    [QUERY_DATA_LAYOUT_FILTER]: query[QUERY_DATA_LAYOUT_FILTER],
    [QUERY_DATA_LAYOUT_PREVIEW]: query[QUERY_DATA_LAYOUT_PREVIEW],
  };
}

export default useDataLayoutMethods;
