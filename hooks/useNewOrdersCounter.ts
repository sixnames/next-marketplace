import { ONE_MINUTE } from 'config/common';
import { GetNewOrdersCounterInput, useGetNewOrdersCounterQuery } from 'generated/apolloComponents';
import * as React from 'react';

export interface UseNewOrdersCounterInterface {
  input?: GetNewOrdersCounterInput;
  allowFetch?: boolean;
}

export function useNewOrdersCounter({
  allowFetch,
  input,
}: UseNewOrdersCounterInterface): null | number {
  const [counter, setCounter] = React.useState<null | number>(null);
  const { data } = useGetNewOrdersCounterQuery({
    pollInterval: ONE_MINUTE,
    variables: {
      input,
    },
  });

  React.useEffect(() => {
    if (allowFetch && data && data.getNewOrdersCounter) {
      setCounter(data.getNewOrdersCounter);
    }
  }, [allowFetch, data]);

  return counter;
}
