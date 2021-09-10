import { REQUEST_METHOD_PATCH } from 'config/common';
import { cancelOrderProduct } from 'db/dao/order/cancelOrderProduct';
import { sendApiRouteResponse, sendApiRouteWrongMethod } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await cancelOrderProduct({
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
