import * as React from 'react';
import useSWR from 'swr';
import {
  GetNewOrdersCounterInputInterface,
  GetNewOrdersCounterPayload,
} from '../db/dao/orders/getNewOrdersCounter';
import { ONE_MINUTE } from '../lib/config/common';
import { noNaN } from '../lib/numbers';
import { stringifyApiParams } from '../lib/qsUtils';

export interface UseNewOrdersCounterInterface {
  input?: GetNewOrdersCounterInputInterface;
  allowFetch?: boolean;
}

export function useNewOrdersCounter({
  allowFetch,
  input,
}: UseNewOrdersCounterInterface): null | number {
  const [counter, setCounter] = React.useState<null | number>(null);
  const params = React.useMemo(() => stringifyApiParams(input), [input]);
  const { data, error } = useSWR<GetNewOrdersCounterPayload>(
    allowFetch ? `/api/order/new-orders-counter${params}` : null,
    {
      refreshInterval: ONE_MINUTE,
    },
  );

  React.useEffect(() => {
    if (data && !error) {
      setCounter(noNaN(data.payload));
    }
  }, [error, data]);

  return counter;
}
