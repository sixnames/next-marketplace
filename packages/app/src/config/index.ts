// Common
export const { NODE_ENV = 'development', API_URL = 'http://localhost:4000/graphql' } = process.env;
export const IN_DEV = NODE_ENV === 'development';
export const IN_PROD = NODE_ENV === 'production';

// Query params
export const QUERY_DATA_LAYOUT_FILTER = 'isFilterVisible';
export const QUERY_DATA_LAYOUT_FILTER_VALUE = '1';
export const QUERY_DATA_LAYOUT_FILTER_ENABLED = `${QUERY_DATA_LAYOUT_FILTER}=${QUERY_DATA_LAYOUT_FILTER_VALUE}`;
export const QUERY_DATA_LAYOUT_PREVIEW = 'isPreviewVisible';
export const QUERY_DATA_LAYOUT_NO_RUBRIC = 'no-rubric';
export const QUERY_DATA_LAYOUT_PAGE = 'page';
