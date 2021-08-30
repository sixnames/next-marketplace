import { REQUEST_METHOD_PATCH } from 'config/common';
import { uploadPostAsset } from 'db/dao/blog/uploadPostAsset';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    return uploadPostAsset(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
