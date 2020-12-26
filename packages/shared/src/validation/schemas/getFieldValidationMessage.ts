import {
  DEFAULT_LANG,
  LANG_NOT_FOUND_FIELD_MESSAGE,
  MessageInterface,
  MessageKey,
  SECONDARY_LANG,
} from '../../config';

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

export function getFieldValidationMessage({
  messages,
  key,
  lang,
}: GetValidationFieldMessageInterface): string {
  const currentMessage = messages.find(({ key: messageKey }) => messageKey === key);
  const errorMessage = `${key} ${LANG_NOT_FOUND_FIELD_MESSAGE}`;
  if (!currentMessage) {
    return errorMessage;
  }

  const { message } = currentMessage;

  const currentLang = message.find(({ key }) => key === lang);
  const defaultLang = message.find(({ key }) => key === DEFAULT_LANG);

  if (!currentLang && lang !== DEFAULT_LANG) {
    const universalLang = message.find(({ key }) => key === SECONDARY_LANG);

    if (!universalLang) {
      if (!defaultLang) {
        return errorMessage;
      }

      return defaultLang.value;
    }

    return universalLang.value;
  }

  if (!currentLang) {
    if (!defaultLang) {
      return errorMessage;
    }

    return defaultLang.value;
  }

  return currentLang.value;
}
