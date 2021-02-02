import { NextApiRequest, NextApiResponse } from 'next';

async function seedDataHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.key !== process.env.INITIAL_DATA_KEY) {
    res.statusCode = 401;
    res.send('Access denied!');
  }

  console.log(JSON.stringify(req.query, null, 2));

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({}));
}

export default seedDataHandler;
