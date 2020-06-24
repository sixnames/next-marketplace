const { env } = process || { env: {} };
export const { NODE_ENV = 'development' } = env;
export const API_PATH = `${process.env.REACT_APP_API_URL}/graphql`;
export const IN_DEV = NODE_ENV === 'development';
export const IN_PROD = NODE_ENV === 'production';
export const IN_TEST = NODE_ENV === 'test';
