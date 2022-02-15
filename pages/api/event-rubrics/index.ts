import { createEventRubric } from 'db/dao/eventRubrics/createEventRubric';
import { deleteEventRubric } from 'db/dao/eventRubrics/deleteEventRubric';
import { getEventRubricsList } from 'db/dao/eventRubrics/getEventRubricsList';
import { updateEventRubric } from 'db/dao/eventRubrics/updateEventRubric';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_GET,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from 'lib/config/common';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // create
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await createEventRubric({
      context: { req, res },
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  // update
  if (req.method === REQUEST_METHOD_PATCH) {
    const payload = await updateEventRubric({
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
    const payload = await deleteEventRubric({
      context: { req, res },
    });
    sendApiRouteResponse({
      payload,
      res,
    });
    return;
  }

  // get list of rubrics
  if (req.method === REQUEST_METHOD_GET) {
    const payload = await getEventRubricsList({
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
