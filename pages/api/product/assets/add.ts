import { addProductAsset } from 'db/dao/product/addProductAsset';
import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_POST } from 'config/common';
import { sendApiRouteResponse } from 'lib/sessionHelpers';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // add
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await addProductAsset({ req, res });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
