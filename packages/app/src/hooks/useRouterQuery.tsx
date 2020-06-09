import qs, { ParsedUrlQuery, ParsedUrlQueryInput } from 'querystring';
import { useLocation, useNavigate } from 'react-router-dom';

interface RemoveQueryInterface {
  key: string;
}

interface SetQueryInterface extends RemoveQueryInterface {
  value: any;
}

interface ReplaceLocationInterface {
  pathname: string;
  query?: ParsedUrlQueryInput | null;
}

interface UseRouterQueryInterface {
  setQuery: ({ key, value }: SetQueryInterface) => void;
  removeQuery: ({ key }: RemoveQueryInterface) => void;
  toggleQuery: ({ key, value }: SetQueryInterface) => void;
  replaceLocation: (args: ReplaceLocationInterface) => void;
  query: ParsedUrlQuery;
  pathname: string;
}

const useRouterQuery = (): UseRouterQueryInterface => {
  const { search = '', pathname } = useLocation();
  const navigate = useNavigate();
  const query = qs.parse(search.slice(1));

  function setQuery({ key, value }: SetQueryInterface) {
    const search = qs.stringify({
      ...query,
      [key]: value,
    });
    navigate(`${pathname}?${search}`);
  }

  function removeQuery({ key }: RemoveQueryInterface) {
    const queryObject = Object.keys(query).reduce((acc: {}, queryKey: string) => {
      if (queryKey === key) {
        return { ...acc };
      }
      return {
        ...acc,
        [queryKey]: query[queryKey],
      };
    }, {});

    const search = qs.stringify(queryObject);
    navigate(`${pathname}?${search}`, { replace: true });
  }

  function toggleQuery({ key, value }: SetQueryInterface) {
    const queryValue = query[key];
    const isExists = queryValue && queryValue === value;

    if (isExists) {
      return removeQuery({ key });
    }

    return setQuery({ key, value });
  }

  function replaceLocation({ pathname, query }: ReplaceLocationInterface) {
    const search = qs.stringify(query || {});
    navigate(`${pathname}?${search}`, { replace: true });
  }

  return { setQuery, removeQuery, toggleQuery, replaceLocation, query, pathname };
};

export default useRouterQuery;
