import { addAttributesGroupToEventRubric } from 'db/dao/eventRubrics/addAttributesGroupToEventRubric';
import { deleteAttributesGroupFromEventRubric } from 'db/dao/eventRubrics/deleteAttributesGroupFromEventRubric';
import { REQUEST_METHOD_DELETE, REQUEST_METHOD_POST } from 'lib/config/common';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // add
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await addAttributesGroupToEventRubric({
      context: { req, res },
      input: JSON.parse(req.body),
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  // delete
  if (req.method === REQUEST_METHOD_DELETE) {
    const payload = await deleteAttributesGroupFromEventRubric({
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
