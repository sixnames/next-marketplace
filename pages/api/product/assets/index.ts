import { deleteProductAsset } from 'db/dao/product/deleteProductAsset';
import { updateProductAssetIndex } from 'db/dao/product/updateProductAssetIndex';
import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH } from 'config/common';
import { sendApiRouteResponse } from 'lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // update
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await updateProductAssetIndex({
      context: { req, res },
      input: JSON.parse(req.body),
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  // delete
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