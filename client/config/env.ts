const { env } = process || { env: {} };
export const { NODE_ENV = 'development' } = env;
const { protocol, host } = window.location;
// export const API_PATH = `${process.env.REACT_APP_API_URL}/graphql`;
export const API_URL = `${protocol}//${host}`;
export const ASSETS_URL = `${API_URL}/api`;
export const API_PATH = `${API_URL}/api/graphql`;
export const IN_DEV = NODE_ENV === 'development';
export const IN_PROD = NODE_ENV === 'production';
export const IN_TEST = NODE_ENV === 'test';
