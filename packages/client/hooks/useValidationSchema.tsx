import { MessageKey } from '@yagu/config';
import { useGetValidationMessagesQuery } from '../generated/apolloComponents';
import { MultiLangSchemaMessagesInterface } from '@yagu/validation';
import { useLanguageContext } from '../context/languageContext';
import * as Yup from 'yup';

interface UseValidationSchemaInterface {
  schema: (args: MultiLangSchemaMessagesInterface) => Yup.ObjectSchema;
}

function useValidationSchema({ schema }: UseValidationSchemaInterface): Yup.ObjectSchema {
  const { lang, defaultLang } = useLanguageContext();
  const { data, error } = useGetValidationMessagesQuery();

  if (error || !data) {
    return Yup.object();
  }

  const { getValidationMessages } = data;

  const messages = getValidationMessages.map(({ key, message }) => ({
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
