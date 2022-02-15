import { toggleCmsCardAttributeInEventRubric } from 'db/dao/eventRubrics/toggleCmsCardAttributeInEventRubric';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_PATCH } from 'lib/config/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // update
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await toggleCmsCardAttributeInEventRubric({
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
