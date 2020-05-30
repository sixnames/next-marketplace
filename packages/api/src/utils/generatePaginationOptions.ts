import { GetPaginationOptionsPayload, PaginationOptions } from '../types/pagination';

const generatePaginationOptions = (args: PaginationOptions): GetPaginationOptionsPayload => {
  const { limit, page, sortDir, sortBy, query } = args;
  const options = {
    limit,
    page,
    sort: `${sortBy} ${sortDir}`,
  };

  const searchOptions = query
    ? {
        $text: {
          $search: query,
          $caseSensitive: false,
        },
      }
    : {};

  return {
    options,
    searchOptions,
  };
};

export default generatePaginationOptions;
