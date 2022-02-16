import { Seeder } from 'mongo-seeding';
import { getProdDb, GetProdDd, updateIndexes } from './getProdDb';

const path = require('path');
require('dotenv').config();

const protocol = 'mongodb';
const host = 'localhost';
const port = 27017;
const username = 'admin';
const password = 'secret';
const dbName = 'dev-db';

const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

const config = {
  dropDatabase: false,
  dropCollections: true,
  databaseReconnectTimeout: 10000,
  database: {
    protocol,
    host,
    port,
    username,
    password,
    name: dbName,
    options: {
      tls: 'true',
      tlsCAFile,
      replicaSet: `${process.env.MONGO_DB_RS}`,
      authSource: dbName,
    },
  },
};

const dbConfig: GetProdDd = {
  uri: `${protocol}://${username}:${password}@${host}:${port}`,
  dbName,
  algoliaProductsIndexName: '',
};

async function seedNewDb() {
  try {
    // seed
    const seeder = new Seeder(config);
    const collections = seeder.readCollectionsFromPath(
      path.resolve(process.cwd(), 'cypress/fixtures/initialData/collections'),
      {
        extensions: ['json', 'ts'],
      },
    );

    await seeder.import(collections);
    console.log('Initial data seeded');

    // create indexes
    const { db, client } = await getProdDb(dbConfig);
    console.log('Creating indexes');
    await updateIndexes(db, client);

    // disconnect form db
    await client.close();
  } catch (err) {
    console.log(err);
  }
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
