import useIsMobile from './useIsMobile';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../config';

function useWithFilterQuery() {
  const isMobile = useIsMobile();
  return isMobile ? '' : QUERY_DATA_LAYOUT_FILTER_ENABLED;
}

export default useWithFilterQuery;
