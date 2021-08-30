import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { createBlogAttribute } from 'db/dao/blog/createBlogAttribute';
import { deleteBlogAttribute } from 'db/dao/blog/deleteBlogAttribute';
import { updateBlogAttribute } from 'db/dao/blog/updateBlogAttribute';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_POST) {
    return createBlogAttribute(req, res);
  }

  if (req.method === REQUEST_METHOD_PATCH) {
    return updateBlogAttribute(req, res);
  }

  if (req.method === REQUEST_METHOD_DELETE) {
    return deleteBlogAttribute(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
