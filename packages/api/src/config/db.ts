import { ConnectionOptions } from 'mongoose';

export const {
  DB_USERNAME = 'admin',
  DB_PASSWORD = 'secret',
  // DB_HOST = 'mongo',
  DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_NAME = 'dev-db',

  ADMIN_NAME = 'admin',
  ADMIN_LAST_NAME = 'site',
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

export const DB_OPTIONS: ConnectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
