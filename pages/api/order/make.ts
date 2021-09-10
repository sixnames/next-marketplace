import { REQUEST_METHOD_POST } from 'config/common';
import { makeAnOrder } from 'db/dao/order/makeAnOrder';
import { sendApiRouteResponse, sendApiRouteWrongMethod } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await makeAnOrder({
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
