import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_GET } from '../../../config/common';
import { getPageSessionUser } from '../../../db/dao/user/getPageSessionUser';
import { getRequestParams } from '../../../lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_GET) {
    const context = { req, res };
    const { locale } = await getRequestParams(context);
    const sessionUser = await getPageSessionUser({
      context,
      locale,
    });
    res.status(200).send(sessionUser);
    return;
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
