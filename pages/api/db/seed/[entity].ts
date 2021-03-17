import { createIndexes } from 'db/initialData/indexes';
import { NextApiRequest, NextApiResponse } from 'next';

async function seedDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const { key, entity } = req.query;

  if (key !== process.env.INITIAL_DATA_KEY || !entity) {
    res.statusCode = 401;
    res.send('Access denied!');
  }

  console.log(`Seeding ${entity} data`);

  // Indexes
  if (entity === 'indexes') {
    await createIndexes();
  }

  res.statusCode = 200;
  res.end('Success!');
}

export default seedDataHandler;
