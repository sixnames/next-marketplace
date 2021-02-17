import { createIndexes } from 'db/createIndexes';
import { createInitialData } from 'db/createInitialData';
import { NextApiRequest, NextApiResponse } from 'next';
import { Seeder } from 'mongo-seeding';
import path from 'path';
import { clearTestData } from 'tests/clearTestData';

async function seedInitial() {
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
  console.log('Seeded >>>>>>>>>>>>>>');
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
  console.log('Seeded >>>>>>>>>>>>>>');
}

async function seedDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const { key, entity, chunkName } = req.query;

  if (key !== process.env.INITIAL_DATA_KEY || !entity) {
    res.statusCode = 401;
    res.send('Access denied!');
  }

  console.log(`Seeding ${entity} data`);

  // Initial
  if (entity === 'initial') {
    await createInitialData();
  }

  // Indexes
  if (entity === 'indexes') {
    await createIndexes();
  }

  // Seed initial
  if (entity === 'local') {
    await clearTestData();
    await createInitialData();
    await seedInitial();
    await createIndexes();
  }

  // Seed chunk
  if (entity === 'chunk') {
    await seedCollectionChunk(`${chunkName}`);
  }

  res.statusCode = 200;
  res.end('Success!');
}

export default seedDataHandler;
