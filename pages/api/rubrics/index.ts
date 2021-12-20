import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_GET } from '../../../config/common';
import { getRubricsList } from '../../../db/dao/rubrics/getRubricsList';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // get list of rubrics
  if (req.method === REQUEST_METHOD_GET) {
    const payload = await getRubricsList({
      context: { req, res },
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
