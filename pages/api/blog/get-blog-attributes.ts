import { REQUEST_METHOD_GET } from 'config/common';
import { getBlogAttributes } from 'db/dao/blog/getBlogAttributes';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_GET) {
    return getBlogAttributes(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
