import { toggleAttributeInRubricFilter } from 'db/dao/rubrics/toggleAttributeInRubricFilter';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_PATCH } from 'config/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // update
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await toggleAttributeInRubricFilter({
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
