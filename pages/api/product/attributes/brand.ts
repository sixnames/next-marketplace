import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_PATCH } from '../../../../config/common';
import { updateProductBrand } from '../../../../db/dao/product/updateProductBrand';
import { sendApiRouteResponse } from '../../../../lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await updateProductBrand({
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