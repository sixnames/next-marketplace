import { REQUEST_METHOD_POST } from 'config/common';
import { makeAnOrder } from 'db/dao/order/makeAnOrder';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_POST) {
    return makeAnOrder(req, res);
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
