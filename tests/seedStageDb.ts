import { Seeder } from 'mongo-seeding';
const path = require('path');
require('dotenv').config();

const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

const config = {
  database: {
    protocol: 'mongodb',
    host: `${process.env.STAGE_MONGO_TEST_HOST}`,
    port: +`${process.env.STAGE_MONGO_TEST_PORT}`,
    username: `${process.env.STAGE_MONGO_TEST_USER_NAME}`,
    password: `${process.env.STAGE_MONGO_TEST_USER_PWD}`,
    name: `${process.env.STAGE_MONGO_DB_NAME}`,
    options: {
      tls: 'true',
      tlsCAFile,
      replicaSet: `${process.env.MONGO_DB_RS}`,
      authSource: `${process.env.STAGE_MONGO_DB_NAME}`,
    },
  },
  dropDatabase: false,
  dropCollections: true,
  databaseReconnectTimeout: 10000,
};

(async function seedStageDb() {
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
  } catch (err) {
    console.log(err);
  }
})();
