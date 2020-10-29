export const IS_BROWSER = typeof window !== 'undefined';

export const ENV = process.env.ENV;
export const IN_PROD = ENV !== 'dev';

export const ASSETS_URL = `${process.env.API_HOST}`;
export const GRAPHQL_API_PATH = `${process.env.API_HOST}${IN_PROD ? '/api' : ''}/graphql`;
