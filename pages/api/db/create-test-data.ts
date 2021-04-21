import { NextApiRequest, NextApiResponse } from 'next';
// import { createTestData } from 'tests/createTestData';

async function createTestDataHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.key !== process.env.TEST_DATA_KEY) {
    res.statusCode = 401;
    res.send('Access denied!');
  }

  // const testData = await createTestData();
  const testData = {};
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(testData));
}

export default createTestDataHandler;
