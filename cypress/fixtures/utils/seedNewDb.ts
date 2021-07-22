import { Seeder } from 'mongo-seeding';
import { uploadTestAssets } from '../../../tests/seedStageDb';
import { getProdDb, GetProdDd, updateIndexes } from './getProdDb';
const path = require('path');

const bucketName = `${process.env.STAGE_OBJECT_STORAGE_BUCKET_NAME}`;
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

const dbConfig: GetProdDd = {
  uri: '',
  dbName: '',
};

async function seedNewDb() {
  // seed
  const seeder = new Seeder(config);
  const collections = seeder.readCollectionsFromPath(
    path.resolve(process.cwd(), 'cypress/fixtures/initialData/collections'),
    {
      extensions: ['json', 'ts'],
    },
  );

  try {
    await seeder.import(collections);
    console.log('Initial data seeded');

    // upload assets
    await uploadTestAssets(`./cypress/fixtures/initialData/assets/`, bucketName);
  } catch (err) {
    console.log(err);
  }

  // create indexes
  const { db, client } = await getProdDb(dbConfig);
  console.log('Creating indexes');
  await updateIndexes(db);

  // disconnect form db
  await client.close();
}

(() => {
  seedNewDb()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
