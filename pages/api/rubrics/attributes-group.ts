import { addAttributesGroupToRubric } from 'db/dao/rubrics/addAttributesGroupToRubric';
import { deleteAttributesGroupFromRubric } from 'db/dao/rubrics/deleteAttributesGroupFromRubric';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_DELETE, REQUEST_METHOD_POST } from 'config/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // add
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await addAttributesGroupToRubric({
      context: { req, res },
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  // delete
  if (req.method === REQUEST_METHOD_DELETE) {
    const payload = await deleteAttributesGroupFromRubric({
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
