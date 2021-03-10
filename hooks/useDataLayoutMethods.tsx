import * as React from 'react';
import useRouterQuery from './useRouterQuery';
import { ParsedUrlQuery } from 'querystring';
import { noNaN } from 'lib/numbers';
import { QUERY_DATA_LAYOUT_PAGE } from 'config/common';
import { ObjectType } from 'types/clientTypes';

export interface UseDataLayoutMethodsInterface {
  setPage: (page: string | number) => void;
  nextPage: () => void;
  prevPage: () => void;
  query: ParsedUrlQuery;
  contentFilters: Record<string, any>;
  page: number;
}

const useDataLayoutMethods = (): UseDataLayoutMethodsInterface => {
  const { query, setQuery } = useRouterQuery();
  const pageNum = React.useMemo(() => {
    return noNaN(query[QUERY_DATA_LAYOUT_PAGE]) || 1;
  }, [query]);

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
        if (key === 'city') {
          return acc;
        }
        acc[key] = query[key];
        return acc;
      }, {}),
    [query],
  );

  return React.useMemo(
    () => ({
      setPage,
      nextPage,
      prevPage,
      query,
      contentFilters,
      [QUERY_DATA_LAYOUT_PAGE]: pageNum,
    }),
    [contentFilters, nextPage, pageNum, prevPage, query, setPage],
  );
};

export default useDataLayoutMethods;
