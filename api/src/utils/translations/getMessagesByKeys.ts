import { MessageModel } from '../../entities/Message';
import { MessageInterface, MessageKey } from '../../config/apiMessages/messagesKeys';

async function getMessagesByKeys(keys: MessageKey[]): Promise<MessageInterface[]> {
  const messages = await MessageModel.find({ key: { $in: keys } })
    .lean()
    .exec();

  return messages.map(({ key, message }) => ({
    key: key as MessageKey,
    message,
  }));
}

export default getMessagesByKeys;
