import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_PATCH } from '../../../config/common';
import { confirmOrder } from '../../../db/dao/orders/confirmOrder';
import { sendApiRouteResponse, sendApiRouteWrongMethod } from '../../../lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await confirmOrder({
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
