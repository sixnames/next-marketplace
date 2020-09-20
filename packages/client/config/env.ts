export const IS_BROWSER = typeof window !== 'undefined';

export const IN_DEV = process.env.NODE_ENV === 'development';
export const IN_PROD = process.env.NODE_ENV === 'production';
export const IN_TEST = process.env.NODE_ENV === 'test';

export const ASSETS_URL = `${process.env.API_HOST}`;
export const GRAPHQL_API_PATH = `${process.env.API_HOST}/api/graphql`;
