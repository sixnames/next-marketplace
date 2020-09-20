import { MessageModel } from '../../entities/Message';
import { LANG_NOT_FOUND_FIELD_MESSAGE, MessageKey } from '@yagu/config';
import getLangField from './getLangField';

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
