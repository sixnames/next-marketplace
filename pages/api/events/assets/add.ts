import { addEventAsset } from 'db/dao/events/addEventAsset';
import { REQUEST_METHOD_POST } from 'lib/config/common';
import { sendApiRouteResponse } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // add
  if (req.method === REQUEST_METHOD_POST) {
    const payload = await addEventAsset({ req, res });
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
