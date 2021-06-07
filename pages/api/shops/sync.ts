import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log({
    body: JSON.parse(req.body || []),
    query: req.query,
  });

  res.status(200).send({
    success: true,
    message: 'success',
  });
};
