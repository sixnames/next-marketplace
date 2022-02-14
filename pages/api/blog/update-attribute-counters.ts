import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_POST } from 'config/common';
import { updateBlogAttributeCounters } from 'db/dao/blog/updateBlogAttributeCounters';
import { sendApiRouteResponse } from 'lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await updateBlogAttributeCounters({
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
