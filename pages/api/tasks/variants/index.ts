import { NextApiRequest, NextApiResponse } from 'next';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { deleteTaskVariant } from 'db/dao/tasks/deleteTaskVariant';
import { updateTaskVariant } from 'db/dao/tasks/updateTaskVariant';
import { createTaskVariant } from 'db/dao/tasks/createTaskVariant';
import { sendApiRouteResponse } from 'lib/sessionHelpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // create
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await createTaskVariant({
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
    const payload = await updateTaskVariant({
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
    const payload = await deleteTaskVariant({
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
