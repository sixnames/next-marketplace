import { REQUEST_METHOD_GET } from 'config/common';
import { getNewOrdersCounter } from 'db/dao/orders/getNewOrdersCounter';
import { parseApiParams } from 'lib/qsUtils';
import { sendApiRouteResponse, sendApiRouteWrongMethod } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_GET) {
    const payload = await getNewOrdersCounter({
      context: { req, res },
      input: parseApiParams(req.query),
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  sendApiRouteWrongMethod(res);
};
