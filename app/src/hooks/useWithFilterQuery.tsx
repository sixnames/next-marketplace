import useIsMobile from './useIsMobile';
import qs from 'querystring';

function useWithFilterQuery() {
  const isMobile = useIsMobile();
  const withFilter = {
    isFilterVisible: 1,
  };

  return isMobile
    ? {}
    : {
        parsed: withFilter,
        string: `?${qs.stringify(withFilter)}`,
      };
}

export default useWithFilterQuery;
