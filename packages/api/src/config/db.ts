import { ConnectionOptions } from 'mongoose';
import commonConfig from '@yagu/config';

export const {
  DB_USERNAME = 'admin',
  DB_PASSWORD = 'secret',
  // DB_HOST = 'mongo',
  DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_NAME = 'dev-db',

  ADMIN_NAME = commonConfig.ADMIN_NAME,
  ADMIN_LAST_NAME = commonConfig.ADMIN_LAST_NAME,
  ADMIN_EMAIL = commonConfig.ADMIN_EMAIL,
  ADMIN_PHONE = commonConfig.ADMIN_PHONE,
  ADMIN_PASSWORD = commonConfig.ADMIN_PASSWORD,

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
