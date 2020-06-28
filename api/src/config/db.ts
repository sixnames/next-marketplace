import { ConnectionOptions } from 'mongoose';

export const {
  DB_USERNAME = 'admin',
  DB_PASSWORD = 'secret',
  DB_HOST = 'mongo',
  // DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_NAME = 'winepoint-db',

  ADMIN_NAME = 'admin',
  ADMIN_EMAIL = 'admin@gmail.com',
  ADMIN_PHONE = '+79998884433',
  ADMIN_PASSWORD = 'admin',
  // MONGO_URL = `mongodb://mongo:27017/app`,
} = process.env;

export const {
  MONGO_URL = `mongodb://${DB_USERNAME}:${encodeURIComponent(
    `${DB_PASSWORD}`,
  )}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
} = process.env;

console.log(JSON.stringify({ env: process.env, url: MONGO_URL }, null, 2));

export const DB_OPTIONS: ConnectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
