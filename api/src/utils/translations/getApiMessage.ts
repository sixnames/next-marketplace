import { MessageModel } from '../../entities/Message';
import { LANG_NOT_FOUND_FIELD_MESSAGE } from '../../config';
import getLangField from './getLangField';

interface GetApiMessageInterface {
  key: string;
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
