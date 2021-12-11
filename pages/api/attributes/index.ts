import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH, REQUEST_METHOD_POST } from 'config/common';
import { createAttribute } from 'db/dao/attributes/createAttribute';
import { deleteAttribute } from 'db/dao/attributes/deleteAttribute';
import { updateAttribute } from 'db/dao/attributes/updateAttribute';
import { updateAlgoliaProducts } from 'lib/algolia/productAlgoliaUtils';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // create
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await createAttribute({
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
    const payload = await updateAttribute({
      context: { req, res },
      input: JSON.parse(req.body),
    });

    sendApiRouteResponse({
      payload,
      res,
    });

    if (payload.success && payload.payload) {
      // update product algolia indexes
      await updateAlgoliaProducts({
        selectedAttributesIds: payload.payload._id,
      });
    }
    return;
  }

  // update
  if (req.method === REQUEST_METHOD_DELETE) {
    const payload = await deleteAttribute({
      context: { req, res },
      input: JSON.parse(req.body),
    });

    sendApiRouteResponse({
      payload,
      res,
    });

    if (payload.success && payload.payload) {
      // update product algolia indexes
      await updateAlgoliaProducts({
        selectedAttributesIds: payload.payload._id,
      });
    }
    return;
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
