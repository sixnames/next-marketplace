import { REQUEST_METHOD_GET } from 'config/common';
import { getConsoleOrders } from 'db/dao/order/getConsoleOrders';
import { parseApiParams } from 'lib/qsUtils';
import { sendApiRouteWrongMethod } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_GET) {
    const payload = await getConsoleOrders({
      context: { req, res },
      input: parseApiParams(req.query),
    });
    res.status(200).send(payload);
    return;
  }

  sendApiRouteWrongMethod(res);
};
