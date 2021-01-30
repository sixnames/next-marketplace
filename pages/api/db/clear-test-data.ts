import { NextApiRequest, NextApiResponse } from 'next';
import { clearTestData } from 'tests/clearTestData';

async function clearTestDataHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.key !== process.env.TEST_DATA_KEY) {
    res.statusCode = 401;
    res.send('Access denied!');
    return;
  }

  await clearTestData();

  res.statusCode = 200;
  res.end('Test data removed.');
}

export default clearTestDataHandler;
