const { env } = process || { env: {} };
export const { NODE_ENV = 'development' } = env;
// TODO api url
// const { protocol, host } = window.location;
// export const API_PATH = `${process.env.REACT_APP_API_URL}/graphql`;
export const API_URL = `http://localhost:4000`;
export const ASSETS_URL = `${API_URL}`;
export const API_PATH = `${API_URL}/api/graphql`;
export const IN_DEV = NODE_ENV === 'development';
export const IN_PROD = NODE_ENV === 'production';
export const IN_TEST = NODE_ENV === 'test';
