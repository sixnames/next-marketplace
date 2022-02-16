import { updateProductCounter } from 'db/dao/product/updateProductCounter';
import { REQUEST_METHOD_PATCH } from 'lib/config/common';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await updateProductCounter({
      context: { req, res },
      input: JSON.parse(req.body),
    });
    res.status(200).send(payload);
    return;
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
