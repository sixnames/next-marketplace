import { MessageKey } from '../config/apiMessages/messagesKeys';
import { useGetMessagesByKeysQuery } from '../generated/apolloComponents';
import {
  MultiLangSchemaMessagesInterface,
  SchemaMessagesInterface,
} from '../validation/getValidationFieldMessage';
import { useLanguageContext } from '../context/languageContext';
import * as Yup from 'yup';

interface UseValidationSchemaInterface {
  schema: (args: SchemaMessagesInterface | MultiLangSchemaMessagesInterface) => Yup.ObjectSchema;
  messagesKeys: MessageKey[];
}

function useValidationSchema({
  schema,
  messagesKeys,
}: UseValidationSchemaInterface): Yup.ObjectSchema {
  const { lang, defaultLang } = useLanguageContext();
  const { data, error } = useGetMessagesByKeysQuery({
    variables: {
      keys: messagesKeys.map((key) => `${key}`),
    },
  });

  if (error || !data) {
    return Yup.object();
  }

  const { getMessagesByKeys } = data;

  const messages = getMessagesByKeys.map(({ key, message }) => ({
    key: key as MessageKey,
    message,
  }));

  return schema({
    lang,
    messages,
    defaultLang,
  });
}

export default useValidationSchema;
