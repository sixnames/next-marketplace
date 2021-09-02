import { REQUEST_METHOD_PATCH } from 'config/common';
import { addPostLike } from 'db/dao/blog/addPostLike';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    return addPostLike(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
