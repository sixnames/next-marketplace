import { NextApiRequest, NextApiResponse } from 'next';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { addCartProduct } from 'db/dao/cart/addCartProduct';
import { deleteCartProduct } from 'db/dao/cart/deleteCartProduct';
import { updateCartProduct } from 'db/dao/cart/updateCartProduct';
import { sendApiRouteResponse } from 'lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // add
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await addCartProduct({
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
    const payload = await updateCartProduct({
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
    const payload = await deleteCartProduct({
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
