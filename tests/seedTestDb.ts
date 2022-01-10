import addZero from 'add-zero';
import { Seeder } from 'mongo-seeding';
import { ID_COUNTER_DIGITS } from '../config/common';
// import { getDatabase } from '../db/mongodb';
// import { updateIndexes } from './testUtils/getProdDb';
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const copy = require('recursive-copy');
require('dotenv').config();

const maxProductsCount = 70 * 4;

function prepareTestAssets() {
  console.log('removing old assets');
  const src = './tests/assets';
  const dist = './assets';
  rimraf(dist, (e: any) => {
    if (e) {
      console.log(e);
    } else {
      console.log('old assets removed');
      console.log('creating new assets');
      copy(src, dist).catch((e: any) => {
        console.log(e);
      });

      console.log('creating product assets');
      for (let i = 1; i <= maxProductsCount; i = i + 1) {
        const itemId: string = addZero(i, ID_COUNTER_DIGITS);
        const pathToSrc = path.join(process.cwd(), 'tests/assets/test-image-0.png');
        const fileName = `${itemId}.png`;
        const pathToDist = path.join(process.cwd(), `assets/products/${itemId}`);
        mkdirp(pathToDist).then(() => {
          fs.copyFileSync(pathToSrc, path.join(pathToDist, fileName));
        });
      }
    }
  });
  return;
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

  const collections = seeder.readCollectionsFromPath(path.resolve(process.cwd(), 'tests/data'), {
    extensions: ['json', 'ts'],
  });

  try {
    await seeder.import(collections);
    console.log(`Test data seeded in ${(new Date().getTime() - startTime) / 1000}s`);

    // console.log('creating indexes');
    // const { db, client } = await getDatabase();
    // await updateIndexes(db);
    // await client.close();
    // console.log('indexes created');

    prepareTestAssets();
    return;
  } catch (err) {
    console.log(err);
  }
})();
