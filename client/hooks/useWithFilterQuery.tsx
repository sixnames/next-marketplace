import { QUERY_DATA_LAYOUT_FILTER, QUERY_DATA_LAYOUT_FILTER_VALUE } from '../config';

function useWithFilterQuery() {
  return {
    [QUERY_DATA_LAYOUT_FILTER]: QUERY_DATA_LAYOUT_FILTER_VALUE,
  };
}

export default useWithFilterQuery;
