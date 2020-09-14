const { env } = process || { env: {} };

export const { NODE_ENV, HTTP_PORT = 4000 } = env;

export const IN_PROD = NODE_ENV === 'production';
export const IN_TEST = NODE_ENV === 'test';
export const IN_DEV = NODE_ENV === 'development';

export const SESSION_COLLECTION = 'sessions';

export const ASSETS_DIST_PRODUCTS = 'products';
