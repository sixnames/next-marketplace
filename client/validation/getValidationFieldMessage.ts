import { DEFAULT_LANG, LANG_NOT_FOUND_FIELD_MESSAGE, SECONDARY_LANG } from '../config';
import { MessageInterface, MessageKey } from '../config/apiMessages/messagesKeys';

export interface SchemaMessagesInterface {
  lang: string;
  messages: MessageInterface[];
}

export interface MultiLangSchemaMessagesInterface extends SchemaMessagesInterface {
  defaultLang: string;
}

interface GetValidationFieldMessageInterface {
  messages: MessageInterface[];
  key: MessageKey;
  lang: string;
}

function getValidationFieldMessage({
  messages,
  key,
  lang,
}: GetValidationFieldMessageInterface): string {
  const currentMessage = messages.find(({ key: messageKey }) => messageKey === key);
  if (!currentMessage) {
    return LANG_NOT_FOUND_FIELD_MESSAGE;
  }

  const { message } = currentMessage;

  const currentLang = message.find(({ key }) => key === lang);
  const defaultLang = message.find(({ key }) => key === DEFAULT_LANG);

  if (!currentLang && lang !== DEFAULT_LANG) {
    const universalLang = message.find(({ key }) => key === SECONDARY_LANG);

    if (!universalLang) {
      if (!defaultLang) {
        return LANG_NOT_FOUND_FIELD_MESSAGE;
      }

      return defaultLang.value;
    }

    return universalLang.value;
  }

  if (!currentLang) {
    if (!defaultLang) {
      return LANG_NOT_FOUND_FIELD_MESSAGE;
    }

    return defaultLang.value;
  }

  return currentLang.value;
}

export default getValidationFieldMessage;
