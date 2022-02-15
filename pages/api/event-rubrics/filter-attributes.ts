import { toggleAttributeInEventRubricFilter } from 'db/dao/eventRubrics/toggleAttributeInEventRubricFilter';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_PATCH } from 'lib/config/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // update
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await toggleAttributeInEventRubricFilter({
      context: { req, res },
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
