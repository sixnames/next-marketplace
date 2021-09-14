import { REQUEST_METHOD_DELETE, REQUEST_METHOD_PATCH } from 'config/common';
import { CancelOrderInputInterface } from 'db/dao/order/cancelOrder';
import { CancelOrderProductInputInterface } from 'db/dao/order/cancelOrderProduct';
import { DeleteOrderInputInterface } from 'db/dao/order/deleteOrder';
import { UpdateOrderProductInputInterface } from 'db/dao/order/updateOrderProduct';
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
    input: '/api/order/product',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: CancelOrderProductInputInterface) => {
      const payload = await handle({
        method: REQUEST_METHOD_DELETE,
        body: JSON.stringify(args),
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};

// update product amount
export const useUpdateOrderProduct = (): UseMutationConsumerPayload<
  OrderPayloadModel,
  UpdateOrderProductInputInterface
> => {
  const [handle, payload] = useMutation<OrderPayloadModel>({
    input: '/api/order/product',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: UpdateOrderProductInputInterface) => {
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

// delete order
export const useDeleteOrder = (): UseMutationConsumerPayload<
  OrderPayloadModel,
  DeleteOrderInputInterface
> => {
  const [handle, payload] = useMutation<OrderPayloadModel>({
    input: '/api/order/delete',
    reload: true,
  });

  const handler = React.useCallback(
    async (args: DeleteOrderInputInterface) => {
      const payload = await handle({
        method: REQUEST_METHOD_DELETE,
        body: JSON.stringify(args),
      });
      return payload;
    },
    [handle],
  );

  return [handler, payload];
};
