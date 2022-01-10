import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_PATCH } from '../../../config/common';
import { moveAttribute } from '../../../db/dao/attributes/moveAttribute';
import { sendApiRouteResponse } from '../../../lib/sessionHelpers';
import { execUpdateProductTitles } from '../../../lib/updateProductTitles';

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
      execUpdateProductTitles(`attributeId=${payload.payload._id.toHexString()}`);
    }
    return;
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
