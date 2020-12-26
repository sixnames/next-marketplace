import { MessageModel } from '../../entities/Message';
import getLangField from './getLangField';
import { LANG_NOT_FOUND_FIELD_MESSAGE, MessageKey } from '@yagu/shared';

interface GetApiMessageInterface {
  key: MessageKey;
  lang: string;
}

async function getApiMessage({ key, lang }: GetApiMessageInterface): Promise<string> {
  const messageEntity = await MessageModel.findOne({ key });
  if (!messageEntity) {
    return LANG_NOT_FOUND_FIELD_MESSAGE;
  }

  return getLangField(messageEntity.message, lang);
}

export default getApiMessage;
