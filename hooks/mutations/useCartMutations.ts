import { useRouter } from 'next/router';
import {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_POST,
} from '../../config/common';
import { useNotificationsContext } from '../../context/notificationsContext';
import { AddCartProductInputInterface } from '../../db/dao/cart/addCartProduct';
import { DeleteCartProductInputInterface } from '../../db/dao/cart/deleteCartProduct';
import { RepeatOrderInputInterface } from '../../db/dao/cart/repeatOrder';
import { UpdateCartProductInputInterface } from '../../db/dao/cart/updateCartProduct';
import {
  MakeAnOrderInputInterface,
  MakeAnOrderPayloadModel,
} from '../../db/dao/orders/makeAnOrder';
import { CartPayloadModel } from '../../db/dbModels';
import { getProjectLinks } from '../../lib/getProjectLinks';
import { useMutationHandler } from './useFetch';

export const cartApiRouteBasePath = '/api/cart';
const productBasePath = `${cartApiRouteBasePath}/product`;

// product
// add
export const useAddCartProduct = (onSuccess: () => void) => {
  return useMutationHandler<CartPayloadModel, AddCartProductInputInterface>({
    path: productBasePath,
    method: REQUEST_METHOD_POST,
    reload: false,
    showNotification: false,
    showLoader: false,
    onSuccess,
  });
};

// update
export const useUpdateCartProduct = (onSuccess: () => void) => {
  return useMutationHandler<CartPayloadModel, UpdateCartProductInputInterface>({
    path: productBasePath,
    method: REQUEST_METHOD_PATCH,
    reload: false,
    showNotification: false,
    showLoader: false,
    onSuccess,
  });
};

// add
export const useDeleteCartProduct = (onSuccess: (payload: CartPayloadModel) => void) => {
  return useMutationHandler<CartPayloadModel, DeleteCartProductInputInterface>({
    path: productBasePath,
    method: REQUEST_METHOD_DELETE,
    reload: false,
    showLoader: false,
    showNotification: false,
    onSuccess,
  });
};

// order
// make order
export const useMakeAnOrder = (onSuccess: () => void) => {
  const router = useRouter();
  const { showErrorNotification } = useNotificationsContext();
  return useMutationHandler<MakeAnOrderPayloadModel, MakeAnOrderInputInterface>({
    path: '/api/order/make',
    method: REQUEST_METHOD_POST,
    reload: false,
    showNotification: false,
    onSuccess: (payload) => {
      if (payload.success) {
        onSuccess();
        const links = getProjectLinks();
        router.push(links.thankYou.url).catch(console.log);
        return;
      }
      showErrorNotification({ title: payload.message });
    },
  });
};

// repeat order
export const useRepeatOrder = (onSuccess: () => void) => {
  return useMutationHandler<CartPayloadModel, RepeatOrderInputInterface>({
    path: `${cartApiRouteBasePath}/repeat-order`,
    method: REQUEST_METHOD_POST,
    reload: false,
    showNotification: false,
    onSuccess,
  });
};
