import { GetPaginationOptionsPayload, PaginationOptions } from '../types/pagination';

const generatePaginationOptions = (args: PaginationOptions): GetPaginationOptionsPayload => {
  const { limit, page, sortDir, sortBy, search } = args;
  // TODO sort by city node field
  const options = {
    limit,
    page,
    sort: `${sortBy} ${sortDir}`,
  };

  const searchOptions = search
    ? {
        $text: {
          $search: search,
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
