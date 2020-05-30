import { ConnectionOptions } from 'mongoose';

export const {
  DB_USERNAME = 'admin',
  DB_PASSWORD = 'secret',
  DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_NAME = 'rg-db',

  ADMIN_NAME = 'admin',
  ADMIN_EMAIL = 'admin@gmail.com',
  ADMIN_PHONE = '+79998884433',
  ADMIN_PASSWORD = 'admin',
} = process.env;

export const DB_URI = `mongodb://${DB_USERNAME}:${encodeURIComponent(
  `${DB_PASSWORD}`,
)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const DB_OPTIONS: ConnectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
