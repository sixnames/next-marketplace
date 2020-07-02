import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { ObjectType } from '../types';

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
  const { pathname = '', query = {} } = router;

  function setQuery({ key, value }: SetQueryInterface) {
    return router.replace({
      pathname,
      query: {
        ...query,
        [key]: value,
      },
    });
  }

  function removeQuery({ key }: RemoveQueryInterface) {
    return router.replace({
      pathname,
      query: Object.keys(query).reduce((acc: ObjectType, queryKey: string) => {
        if (queryKey === key) {
          return { ...acc };
        }
        return {
          ...acc,
          [queryKey]: query[queryKey],
        };
      }, {}),
    });
  }

  function toggleQuery({ key, value }: SetQueryInterface) {
    const queryValue = query[key];
    const isExists = queryValue && queryValue === value;

    if (isExists) {
      return removeQuery({ key });
    }

    return setQuery({ key, value });
  }

  return { setQuery, removeQuery, toggleQuery, query, pathname };
};

export default useRouterQuery;
