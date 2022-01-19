import { NextApiRequest, NextApiResponse } from 'next';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../../../config/common';
import { createPromoCode } from '../../../../db/dao/promo/createPromoCode';
import { deletePromoCode } from '../../../../db/dao/promo/deletePromoCode';
import { updatePromoCode } from '../../../../db/dao/promo/updatePromoCode';
import { sendApiRouteResponse } from '../../../../lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // create
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await createPromoCode({
      context: { req, res },
      input: JSON.parse(req.body),
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  // update
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await updatePromoCode({
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
    const payload = await deletePromoCode({
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
