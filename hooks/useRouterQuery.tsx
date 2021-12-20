import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useCallback, useMemo } from 'react';
import { ObjectType } from '../types/clientTypes';

interface RemoveQueryInterface {
  key: string;
}

interface SetQueryInterface extends RemoveQueryInterface {
  value: any;
}

interface UseRouterQueryInterface {
  setQuery: ({ key, value }: SetQueryInterface) => void;
  removeQuery: ({ key }: RemoveQueryInterface) => void;
  toggleQuery: ({ key, value }: SetQueryInterface) => void;
  query: ParsedUrlQuery;
  pathname: string;
}

const useRouterQuery = (): UseRouterQueryInterface => {
  const router = useRouter();

  const setQuery = useCallback(
    ({ key, value }: SetQueryInterface) => {
      router
        .replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              [key]: value,
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
        .catch((e) => console.log(e));
    },
    [router],
  );

  const removeQuery = useCallback(
    ({ key }: RemoveQueryInterface) =>
      router.replace({
        pathname: router.pathname,
        query: Object.keys(router.query).reduce((acc: ObjectType, queryKey: string) => {
          if (queryKey === key) {
            return { ...acc };
          }
          return {
            ...acc,
            [queryKey]: router.query[queryKey],
          };
        }, {}),
      }),
    [router],
  );

  const toggleQuery = useCallback(
    ({ key, value }: SetQueryInterface) => {
      const queryValue = router.query[key];
      const isExists = queryValue && queryValue === value;

      if (isExists) {
        return removeQuery({ key });
      }

      return setQuery({ key, value });
    },
    [removeQuery, router.query, setQuery],
  );

  return useMemo(
    () => ({
      setQuery,
      removeQuery,
      toggleQuery,
      query: router.query,
      pathname: router.pathname || '',
    }),
    [router, removeQuery, setQuery, toggleQuery],
  );
};

export default useRouterQuery;
