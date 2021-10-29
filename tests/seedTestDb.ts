import { Seeder } from 'mongo-seeding';
import products from '../cypress/fixtures/data/products/products';
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const copy = require('recursive-copy');
require('dotenv').config();

function prepareTestAssets() {
  products.forEach(({ itemId }) => {
    const pathToSrc = path.join(process.cwd(), 'cypress/fixtures/test-image-0.png');
    const fileName = `${itemId}-0.png`;
    const pathToDist = path.join(process.cwd(), `cypress/fixtures/assets/products/${itemId}`);
    fs.access(pathToDist, (err: any) => {
      if (err) {
        mkdirp(pathToDist).then(() => {
          fs.copyFileSync(pathToSrc, path.join(pathToDist, fileName));
        });
      } else {
        fs.copyFileSync(pathToSrc, path.join(pathToDist, fileName));
      }
    });
  });

  const src = './cypress/fixtures/assets';
  const dist = './public/assets';
  rimraf(dist, (e: any) => {
    if (e) {
      console.log(e);
    } else {
      console.log('old assets removed');
      copy(src, dist).catch((e: any) => {
        console.log(e);
      });
    }
  });
}

const config = {
  database: {
    protocol: 'mongodb',
    host: `${process.env.MONGO_TEST_HOST}`,
    port: +`${process.env.MONGO_TEST_PORT}`,
    username: `${process.env.MONGO_TEST_USER_NAME}`,
    password: `${process.env.MONGO_TEST_USER_PWD}`,
    name: `${process.env.MONGO_DB_NAME}`,
  },
  dropDatabase: false,
  dropCollections: true,
  databaseReconnectTimeout: 10000,
};

(async function seedTestDb() {
  const startTime = new Date().getTime();
  const seeder = new Seeder(config);

  const collections = seeder.readCollectionsFromPath(
    path.resolve(process.cwd(), 'cypress/fixtures/data'),
    {
      extensions: ['json', 'ts'],
    },
  );

  try {
    await seeder.import(collections);
    console.log(`Test data seeded in ${(new Date().getTime() - startTime) / 1000}s`);
    prepareTestAssets();
  } catch (err) {
    console.log(err);
  }
})();
