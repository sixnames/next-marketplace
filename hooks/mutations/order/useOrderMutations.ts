import { REQUEST_METHOD_PATCH } from 'config/common';
import { CancelOrderInputInterface } from 'db/dao/order/cancelOrder';
import { CancelOrderProductInputInterface } from 'db/dao/order/cancelOrderProduct';
import * as React from 'react';
import { ConfirmOrderInputInterface } from 'db/dao/order/confirmOrder';
import { OrderPayloadModel } from 'db/dbModels';
import { useMutation, UseMutationConsumerPayload } from 'hooks/mutations/useFetch';

// confirm order
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

// cancel order
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

// update product amount
export const useCancelOrderProduct = (): UseMutationConsumerPayload<
  OrderPayloadModel,
  CancelOrderProductInputInterface
> => {
  const [handle, payload] = useMutation<OrderPayloadModel>({
    input: '/api/order/cancel-product',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: CancelOrderProductInputInterface) => {
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
