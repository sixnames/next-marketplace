import { MessageModel } from '../../entities/Message';
import { MessageInterface, MessageKey } from '@yagu/shared';

async function getMessagesByKeys(keys: MessageKey[]): Promise<MessageInterface[]> {
  const validationMessages = await MessageModel.find({
    key: { $regex: /validation/ },
  })
    .lean()
    .exec();

  let queriedMessages: any[] = [];
  if (keys && keys.length) {
    queriedMessages = await MessageModel.find({ key: { $in: keys } })
      .lean()
      .exec();
  }

  return [...validationMessages, ...queriedMessages].map(({ key, message }) => ({
    key: key as MessageKey,
    message,
  }));
}

export default getMessagesByKeys;
