import { createRubric } from 'db/dao/rubrics/createRubric';
import { deleteRubric } from 'db/dao/rubrics/deleteRubric';
import { updateRubric } from 'db/dao/rubrics/updateRubric';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_GET,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { getRubricsList } from 'db/dao/rubrics/getRubricsList';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // create
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await createRubric({
      context: { req, res },
      input: JSON.parse(req.body),
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  // update
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await updateRubric({
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
    const payload = await deleteRubric({
      context: { req, res },
      input: JSON.parse(req.body),
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

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
