import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_GET } from 'lib/config/common';
import { getValidationMessages } from 'db/utils/apiMessageUtils';
import { MessageModel, PayloadType } from 'db/dbModels';
import { sendApiRouteResponse, sendApiRouteWrongMethod } from 'lib/sessionHelpers';

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
