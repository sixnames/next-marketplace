import { REQUEST_METHOD_PATCH } from 'config/common';
import { updateBlogPostAttribute } from 'db/dao/blog/updateBlogPostAttribute';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    return updateBlogPostAttribute(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
