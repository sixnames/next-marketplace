import {
  ASSETS_DIST_COMPANIES,
  ASSETS_DIST_PAGES,
  // ASSETS_DIST_CONFIGS,
  ASSETS_DIST_SHOPS,
  ASSETS_DIST_SHOPS_LOGOS,
  ASSETS_DIST_TEMPLATES,
} from '../config/common';
import { Seeder } from 'mongo-seeding';
const path = require('path');
const EasyYandexS3 = require('easy-yandex-s3');

require('dotenv').config();

export async function uploadTestAssets(srcPath: string, distPath = '/') {
  const s3 = new EasyYandexS3({
    auth: {
      accessKeyId: `${process.env.OBJECT_STORAGE_KEY_ID}`,
      secretAccessKey: `${process.env.OBJECT_STORAGE_KEY}`,
    },
    Bucket: `${process.env.OBJECT_STORAGE_BUCKET_NAME}`,
    // debug: true,
  });

  try {
    await s3.Upload(
      {
        path: srcPath,
        save_name: true,
      },
      distPath,
    );
    console.log(`${distPath} assets uploaded`);
  } catch (e) {
    console.log(e);
  }
}

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

  try {
    await seeder.import(collections);
    console.log('Test data seeded');
    // await uploadTestAssets('./cypress/fixtures/assets');

    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_SHOPS_LOGOS}`,
      `/${ASSETS_DIST_SHOPS_LOGOS}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_SHOPS}`,
      `/${ASSETS_DIST_SHOPS}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_COMPANIES}`,
      `/${ASSETS_DIST_COMPANIES}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_PAGES}`,
      `/${ASSETS_DIST_PAGES}`,
    );
    await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_TEMPLATES}`,
      `/${ASSETS_DIST_TEMPLATES}`,
    );
    /*await uploadTestAssets(
      `./cypress/fixtures/assets/${ASSETS_DIST_CONFIGS}`,
      `/${ASSETS_DIST_CONFIGS}`,
    );*/
  } catch (err) {
    console.log(err);
  }
})();
