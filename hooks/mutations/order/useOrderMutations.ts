import { REQUEST_METHOD_PATCH } from 'config/common';
import { CancelOrderInputInterface } from 'db/dao/order/cancelOrder';
import * as React from 'react';
import { ConfirmOrderInputInterface } from 'db/dao/order/confirmOrder';
import { OrderPayloadModel } from 'db/dbModels';
import { useMutation, UseMutationConsumerPayload } from 'hooks/mutations/useFetch';

export const useConfirmOrder = (): UseMutationConsumerPayload<
  OrderPayloadModel,
  ConfirmOrderInputInterface
> => {
  const [handle, payload] = useMutation<OrderPayloadModel>({
    input: '/api/order/confirm',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: ConfirmOrderInputInterface) => {
      const payload = await handle({
        method: REQUEST_METHOD_PATCH,
        body: JSON.stringify(args),
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};

export const useCancelOrder = (): UseMutationConsumerPayload<
  OrderPayloadModel,
  CancelOrderInputInterface
> => {
  const [handle, payload] = useMutation<OrderPayloadModel>({
    input: '/api/order/cancel',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: CancelOrderInputInterface) => {
      const payload = await handle({
        method: REQUEST_METHOD_PATCH,
        body: JSON.stringify(args),
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};
