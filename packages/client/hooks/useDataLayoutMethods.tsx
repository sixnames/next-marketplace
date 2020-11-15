import React from 'react';
import useRouterQuery from './useRouterQuery';
import {
  QUERY_DATA_LAYOUT_FILTER,
  QUERY_DATA_LAYOUT_FILTER_VALUE,
  QUERY_DATA_LAYOUT_PAGE,
  QUERY_DATA_LAYOUT_PREVIEW,
} from '../config';
import { ObjectType } from '../types';
import { noNaN } from '../utils/noNaN';
import { ParsedUrlQuery } from 'querystring';

export interface UseDataLayoutMethodsInterface {
  toggleFilter: () => void;
  setPreviewId: (id: string | number) => void;
  removePreviewId: () => void;
  setPage: (page: string | number) => void;
  nextPage: () => void;
  prevPage: () => void;
  query: ParsedUrlQuery;
  contentFilters: Record<string, any>;
  page: number;
  isFilterVisible?: boolean;
  isPreviewVisible?: boolean;
}

const useDataLayoutMethods = (): UseDataLayoutMethodsInterface => {
  const { query, toggleQuery, setQuery, removeQuery } = useRouterQuery();
  const pageNum = React.useMemo(() => {
    return noNaN(query[QUERY_DATA_LAYOUT_PAGE]) || 1;
  }, [query]);

  const toggleFilter = React.useCallback(() => {
    toggleQuery({ key: QUERY_DATA_LAYOUT_FILTER, value: QUERY_DATA_LAYOUT_FILTER_VALUE });
  }, [toggleQuery]);

  const setPreviewId = React.useCallback(
    (id: string | number) => {
      setQuery({ key: QUERY_DATA_LAYOUT_PREVIEW, value: id });
    },
    [setQuery],
  );

  const removePreviewId = React.useCallback(() => {
    removeQuery({ key: QUERY_DATA_LAYOUT_PREVIEW });
  }, [removeQuery]);

  const setPage = React.useCallback(
    (page: string | number) => {
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

  const contentFilters = React.useMemo(
    () =>
      Object.keys(query).reduce((acc: ObjectType, key) => {
        if (key === QUERY_DATA_LAYOUT_FILTER || key === QUERY_DATA_LAYOUT_PREVIEW) {
          return acc;
        }
        acc[key] = query[key];
        return acc;
      }, {}),
    [query],
  );

  return React.useMemo(
    () => ({
      toggleFilter,
      setPreviewId,
      removePreviewId,
      setPage,
      nextPage,
      prevPage,
      query,
      contentFilters,
      [QUERY_DATA_LAYOUT_PAGE]: pageNum,
      [QUERY_DATA_LAYOUT_FILTER]: Boolean(query[QUERY_DATA_LAYOUT_FILTER]),
      [QUERY_DATA_LAYOUT_PREVIEW]: Boolean(query[QUERY_DATA_LAYOUT_PREVIEW]),
    }),
    [
      contentFilters,
      nextPage,
      pageNum,
      prevPage,
      query,
      removePreviewId,
      setPage,
      setPreviewId,
      toggleFilter,
    ],
  );
};

export default useDataLayoutMethods;
