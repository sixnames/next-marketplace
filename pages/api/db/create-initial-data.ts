import { NextApiRequest, NextApiResponse } from 'next';
import { createInitialData } from 'db/createInitialData';

async function createInitialDataHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.key !== process.env.INITIAL_DATA_KEY) {
    res.statusCode = 401;
    res.send('Access denied!');
  }

  const initialData = await createInitialData();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(initialData));
}

export default createInitialDataHandler;
