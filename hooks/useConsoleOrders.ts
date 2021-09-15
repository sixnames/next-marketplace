import { ONE_MINUTE } from 'config/common';
import {
  GetConsoleOrdersInputInterface,
  GetConsoleOrdersPayloadType,
} from 'db/dao/order/getConsoleOrders';
import { stringifyApiParams } from 'lib/qsUtils';
import * as React from 'react';
import useSWR from 'swr';

export interface UseConsoleOrdersPayloadInterface {
  data?: GetConsoleOrdersPayloadType;
  error?: any;
}

export interface UseConsoleOrdersInterface {
  input?: GetConsoleOrdersInputInterface;
}

export function useConsoleOrders(
  props?: UseConsoleOrdersInterface,
): UseConsoleOrdersPayloadInterface {
  const params = React.useMemo(() => stringifyApiParams(props?.input), [props]);
  const { data, error } = useSWR<GetConsoleOrdersPayloadType>(
    `/api/order/console-orders${params}`,
    {
      refreshInterval: ONE_MINUTE,
    },
  );

  return { data, error };
}
