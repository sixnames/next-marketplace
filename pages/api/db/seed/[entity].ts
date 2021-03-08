import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
} from 'db/collectionNames';
import { createIndexes } from 'db/createIndexes';
// import { createInitialData } from 'db/createInitialData';
import { updateCollectionItemId } from 'lib/itemIdUtils';
import { NextApiRequest, NextApiResponse } from 'next';
// import { Seeder } from 'mongo-seeding';
// import path from 'path';
// import { clearTestData } from 'tests/clearTestData';

/*async function seedInitial() {
  await createInitialData();

  process.env.DEBUG = 'mongo-seeding';
  const config = {
    database: process.env.MONGO_URL,
    dropDatabase: false,
  };
  const seeder = new Seeder(config);
  const collections = seeder.readCollectionsFromPath(path.resolve('./db/initialData/parsed'));
  try {
    await seeder.import(collections);
  } catch (e) {
    // Handle errors
    console.log('Error ', e);
  }
  console.log('Seeded initial data >>>>>>>>>>>>>>');
}

async function seedCollectionChunk(chunkName: string) {
  process.env.DEBUG = 'mongo-seeding';
  const config = {
    database: process.env.MONGO_URL,
    dropDatabase: false,
  };
  const seeder = new Seeder(config);
  const collections = seeder.readCollectionsFromPath(
    path.resolve(`./db/initialData/parsedBigCollections/${chunkName}`),
  );
  try {
    await seeder.import(collections);
  } catch (e) {
    // Handle errors
    console.log('Error ', e);
  }
  console.log(`Seeded ${chunkName} chunk >>>>>>>>>>>>>>`);
}*/

async function seedDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const { key, entity } = req.query;

  if (key !== process.env.INITIAL_DATA_KEY || !entity) {
    res.statusCode = 401;
    res.send('Access denied!');
  }

  console.log(`Seeding ${entity} data`);

  // Seed initial
  /*if (entity === 'initial') {
    console.log('Clearing db');
    await clearTestData();

    console.log('Creating initial data');
    await createInitialData();

    console.log('Success!');
    // await seedInitial();
  }*/

  // Chunk A
  /*if (entity === 'chunkA') {
    const chunks = ['allProducts', 'wine-a'];
    for await (const chunkName of chunks) {
      await seedCollectionChunk(chunkName);
    }
  }*/

  // Chunk B
  /*if (entity === 'chunkB') {
    const chunks = ['wine-b', 'wine-c', 'wine-d'];
    for await (const chunkName of chunks) {
      await seedCollectionChunk(chunkName);
    }
  }*/

  // Indexes
  if (entity === 'indexes') {
    console.log('Updating itemId counters');
    const itemIdCollections = [COL_BRAND_COLLECTIONS, COL_BRANDS, COL_MANUFACTURERS, COL_PRODUCTS];
    for await (const collectionName of itemIdCollections) {
      await updateCollectionItemId(collectionName);
    }

    console.log('Creating indexes');
    await createIndexes();
  }

  res.statusCode = 200;
  res.end('Success!');
}

export default seedDataHandler;
