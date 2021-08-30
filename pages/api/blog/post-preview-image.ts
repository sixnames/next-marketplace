import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH } from 'config/common';
import { deletePostPreviewImage } from 'db/dao/blog/deletePostPreviewImage';
import { updatePostPreviewImage } from 'db/dao/blog/uploadPostPreviewImage';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    return updatePostPreviewImage(req, res);
  }

  if (req.method === REQUEST_METHOD_DELETE) {
    return deletePostPreviewImage(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
