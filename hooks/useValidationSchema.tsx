import * as React from 'react';
import useSWR from 'swr';
import * as Yup from 'yup';
import { useLocaleContext } from '../context/localeContext';
import { ResolverValidationSchema } from '../lib/sessionHelpers';
import { GetValidationMessagesPayloadType } from '../pages/api/messages/validation';
import { ValidationSchemaArgsInterface } from '../types/validataionTypes';

interface UseValidationSchemaInterface {
  schema: (args: ValidationSchemaArgsInterface) => ResolverValidationSchema;
}

function useValidationSchema({ schema }: UseValidationSchemaInterface): ResolverValidationSchema {
  const { locale } = useLocaleContext();
  const { data, error } = useSWR<GetValidationMessagesPayloadType>('/api/messages/validation');

  const payload = React.useMemo(() => {
    return schema({
      locale,
      messages: data?.payload || [],
    });
  }, [data, locale, schema]);

  if (error || !data) {
    return Yup.object();
  }

  return payload;
}

export default useValidationSchema;
