import { NextApiRequest, NextApiResponse } from 'next';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../../config/common';
import { createBlogPost } from '../../../db/dao/blog/createBlogPost';
import { deleteBlogPost } from '../../../db/dao/blog/deleteBlogPost';
import { updateBlogPost } from '../../../db/dao/blog/updateBlogPost';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_POST) {
    return createBlogPost(req, res);
  }

  if (req.method === REQUEST_METHOD_PATCH) {
    return updateBlogPost(req, res);
  }

  if (req.method === REQUEST_METHOD_DELETE) {
    return deleteBlogPost(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
