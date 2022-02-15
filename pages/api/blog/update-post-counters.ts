import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_POST } from 'lib/config/common';
import { updateBlogPostCounters } from 'db/dao/blog/updateBlogPostCounters';
import { sendApiRouteResponse } from 'lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await updateBlogPostCounters({
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
