import { toggleCmsCardAttributeInRubric } from 'db/dao/rubrics/toggleCmsCardAttributeInRubric';
import { REQUEST_METHOD_PATCH } from 'lib/config/common';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // update
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await toggleCmsCardAttributeInRubric({
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