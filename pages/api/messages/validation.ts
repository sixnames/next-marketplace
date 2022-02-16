import { MessageModel, PayloadType } from 'db/dbModels';
import { getValidationMessages } from 'db/utils/apiMessageUtils';
import { REQUEST_METHOD_GET } from 'lib/config/common';
import { sendApiRouteResponse, sendApiRouteWrongMethod } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export type GetValidationMessagesPayloadType = PayloadType<MessageModel[]>;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === REQUEST_METHOD_GET) {
    const messages = await getValidationMessages();
    sendApiRouteResponse({
      payload: {
        success: true,
        payload: messages,
      },
      res,
    });
    return;
  }

  sendApiRouteWrongMethod(res);
};
