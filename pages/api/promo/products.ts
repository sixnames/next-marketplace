import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_DELETE, REQUEST_METHOD_POST } from '../../../config/common';
import { addPromoProducts } from '../../../db/dao/promo/addPromoProducts';
import { deletePromoProducts } from '../../../db/dao/promo/deletePromoProducts';
import { sendApiRouteResponse } from '../../../lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // create
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await addPromoProducts({
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
    const payload = await deletePromoProducts({
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
