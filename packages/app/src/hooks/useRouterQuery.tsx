import { ParsedUrlQuery } from 'querystring';

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
}

const useRouterQuery = (): UseRouterQueryInterface => {
  // TODO [Slava] router query
  const router: any = { pathname: '', query: {} };
  const { pathname = '', query = {} } = router;

  function setQuery({ key, value }: SetQueryInterface) {
    router.replace({
      pathname,
      query: {
        ...query,
        [key]: value,
      },
    });
  }

  function removeQuery({ key }: RemoveQueryInterface) {
    router.replace({
      pathname,
      query: Object.keys(query).reduce((acc: {}, queryKey: string) => {
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

  return { setQuery, removeQuery, toggleQuery, query };
};

export default useRouterQuery;
