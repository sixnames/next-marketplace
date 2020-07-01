import useIsMobile from './useIsMobile';
import { QUERY_DATA_LAYOUT_FILTER, QUERY_DATA_LAYOUT_FILTER_VALUE } from '../config';

function useWithFilterQuery() {
  const isMobile = useIsMobile();
  return {
    [QUERY_DATA_LAYOUT_FILTER]: isMobile ? '' : QUERY_DATA_LAYOUT_FILTER_VALUE,
  };
}

export default useWithFilterQuery;
