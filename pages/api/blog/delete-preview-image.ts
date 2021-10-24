import { REQUEST_METHOD_DELETE } from 'config/common';
import { deletePostPreviewImage } from 'db/dao/blog/deletePostPreviewImage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_DELETE) {
    return deletePostPreviewImage(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
