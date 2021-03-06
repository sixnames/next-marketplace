import { updatePostPreviewImage } from 'db/dao/blog/uploadPostPreviewImage';
import { REQUEST_METHOD_PATCH } from 'lib/config/common';
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

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
