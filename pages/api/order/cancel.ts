import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_PATCH } from '../../../config/common';
import { cancelOrder } from '../../../db/dao/orders/cancelOrder';
import { sendApiRouteResponse, sendApiRouteWrongMethod } from '../../../lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await cancelOrder({
      context: { req, res },
      input: JSON.parse(req.body),
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  sendApiRouteWrongMethod(res);
};
