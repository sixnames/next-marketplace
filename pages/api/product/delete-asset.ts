import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_DELETE } from '../../../config/common';
import { deleteProductAsset } from '../../../db/dao/product/deleteProductAsset';
import { sendApiRouteResponse } from '../../../lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_DELETE) {
    const payload = await deleteProductAsset({
      context: { req, res },
      input: JSON.parse(req.body),
    });
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
