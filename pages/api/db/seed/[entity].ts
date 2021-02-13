import { createInitialData } from 'db/createInitialData';
import { NextApiRequest, NextApiResponse } from 'next';

async function seedDataHandler(req: NextApiRequest, res: NextApiResponse) {
  const { key, entity } = req.query;

  if (key !== process.env.INITIAL_DATA_KEY || !entity) {
    res.statusCode = 401;
    res.send('Access denied!');
  }

  console.log(`Seeding ${entity} data`);

  // Initial
  if (entity === 'initial') {
    await createInitialData();
  }

  res.statusCode = 200;
  res.end('Success!');
}

export default seedDataHandler;
