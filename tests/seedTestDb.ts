import { uploadTestAssets } from './uploadTestAssets';
import {
  ASSETS_DIST_COMPANIES,
  ASSETS_DIST_PAGES,
  ASSETS_DIST_BRANDS,
  // ASSETS_DIST_CONFIGS,
  ASSETS_DIST_SHOPS,
  ASSETS_DIST_SHOPS_LOGOS,
  ASSETS_DIST_TEMPLATES,
  ASSETS_DIST_CATEGORIES,
  ASSETS_DIST_BLOG,
} from '../config/common';
import { Seeder } from 'mongo-seeding';
const path = require('path');
require('dotenv').config();

// const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

const config = {
  database: {
    protocol: 'mongodb',
    host: `${process.env.MONGO_TEST_HOST}`,
    port: +`${process.env.MONGO_TEST_PORT}`,
    username: `${process.env.MONGO_TEST_USER_NAME}`,
    password: `${process.env.MONGO_TEST_USER_PWD}`,
    name: `${process.env.MONGO_DB_NAME}`,
    /*options: {
      tls: 'true',
      tlsCAFile,
      replicaSet: `${process.env.MONGO_DB_RS}`,
      authSource: `${process.env.MONGO_DB_NAME}`,
    },*/
  },
  dropDatabase: false,
  dropCollections: true,
  databaseReconnectTimeout: 10000,
};

(async function seedTestDb() {
  const seeder = new Seeder(config);

  const collections = seeder.readCollectionsFromPath(
    path.resolve(process.cwd(), 'cypress/fixtures/data'),
    {
      extensions: ['json', 'ts'],
    },
  );

  const bucketName = `${process.env.OBJECT_STORAGE_BUCKET_NAME}`;

  try {
    await seeder.import(collections);
    console.log('Test data seeded');
    // await uploadTestAssets('./cypress/fixtures/assets');

    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_SHOPS_LOGOS}`,
      bucketName,
      `/${ASSETS_DIST_SHOPS_LOGOS}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_SHOPS}`,
      bucketName,
      `/${ASSETS_DIST_SHOPS}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_COMPANIES}`,
      bucketName,
      `/${ASSETS_DIST_COMPANIES}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_PAGES}`,
      bucketName,
      `/${ASSETS_DIST_PAGES}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_TEMPLATES}`,
      bucketName,
      `/${ASSETS_DIST_TEMPLATES}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_BRANDS}`,
      bucketName,
      `/${ASSETS_DIST_BRANDS}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_CATEGORIES}`,
      bucketName,
      `/${ASSETS_DIST_CATEGORIES}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_BLOG}`,
      bucketName,
      `/${ASSETS_DIST_BLOG}`,
    );
    /*await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_CONFIGS}`,
      `/${ASSETS_DIST_CONFIGS}`,
    );*/
  } catch (err) {
    console.log(err);
  }
})();
