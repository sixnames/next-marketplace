export const IS_BROWSER = typeof window !== 'undefined';

export const IN_DEV = process.env.NODE_ENV === 'development';
export const IN_PROD = process.env.NODE_ENV === 'production';
export const IN_TEST = process.env.NODE_ENV === 'test';

export const DEV_API_URL = `http://localhost:4000`;
export const ASSETS_URL = process.env.ASSETS_HOST ? `${process.env.ASSETS_HOST}` : '';
export const GRAPHQL_API_PATH = `${DEV_API_URL}/graphql`;

const buildEnv = process.env.NEXT_NODE_ENV;
const testingApiUri = IS_BROWSER ? process.env.API_BROWSER_HOST : process.env.API_HOST;
export const API_URI = buildEnv === 'testing' ? testingApiUri : process.env.PRODUCTION_API_HOST;
console.log(API_URI);
