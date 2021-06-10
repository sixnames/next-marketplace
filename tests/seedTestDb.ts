import { Seeder } from 'mongo-seeding';
const path = require('path');
const EasyYandexS3 = require('easy-yandex-s3');

require('dotenv').config();

export async function uploadTestAssets() {
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
        path: './cypress/fixtures/assets',
        save_name: true,
      },
      '/',
    );
    console.log('Assets uploaded');
  } catch (e) {
    console.log(e);
  }
}

const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

const config = {
  database: {
    protocol: 'mongodb',
    host: `${process.env.MONGO_TEST_HOST}`,
    port: 27018,
    username: `${process.env.MONGO_TEST_USER_NAME}`,
    password: `${process.env.MONGO_TEST_USER_PWD}`,
    name: `${process.env.MONGO_DB_NAME}`,
    options: {
      tls: 'true',
      tlsCAFile,
      replicaSet: `${process.env.MONGO_DB_RS}`,
      authSource: `${process.env.MONGO_DB_NAME}`,
    },
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
    // await uploadTestAssets();
  } catch (err) {
    console.log(err);
  }
})();
