import * as React from 'react';
import { useGetValidationMessagesQuery } from 'generated/apolloComponents';
import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { useLocaleContext } from 'context/localeContext';
import { ResolverValidationSchema } from 'lib/sessionHelpers';

interface UseValidationSchemaInterface {
  schema: (args: ValidationSchemaArgsInterface) => ResolverValidationSchema;
}

function useValidationSchema({ schema }: UseValidationSchemaInterface): ResolverValidationSchema {
  const { locale } = useLocaleContext();
  const { data, error } = useGetValidationMessagesQuery();

  const payload = React.useMemo(() => {
    return schema({
      locale,
      messages: data?.getValidationMessages || [],
    });
  }, [data, locale, schema]);

  if (error || !data) {
    return Yup.object();
  }

  return payload;
}

export default useValidationSchema;
