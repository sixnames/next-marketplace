import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH } from 'config/common';
import { deleteOrder } from 'db/dao/orders/deleteOrder';
import { updateOrder } from 'db/dao/orders/updateOrder';
import { sendApiRouteResponse, sendApiRouteWrongMethod } from 'lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await updateOrder({
      context: { req, res },
      input: JSON.parse(req.body),
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  if (req.method === REQUEST_METHOD_DELETE) {
    const payload = await deleteOrder({
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
