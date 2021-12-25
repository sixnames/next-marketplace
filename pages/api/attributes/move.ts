import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_PATCH } from '../../../config/common';
import { moveAttribute } from '../../../db/dao/attributes/moveAttribute';
import { updateProductTitles } from '../../../lib/productUtils';
import { sendApiRouteResponse } from '../../../lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // move
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await moveAttribute({
      context: { req, res },
      input: JSON.parse(req.body),
    });

    sendApiRouteResponse({
      payload,
      res,
    });

    if (payload.success && payload.payload) {
      // update product algolia indexes
      await updateProductTitles({
        'attributes.attributeId': payload.payload._id,
      });
    }
    return;
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
