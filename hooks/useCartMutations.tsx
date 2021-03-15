import { CartModalInterface } from 'components/Modal/CartModal/CartModal';
import { CART_MODAL } from 'config/modals';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import {
  AddProductToCartInput,
  AddShoplessProductToCartInput,
  AddShopToCartProductInput,
  DeleteProductFromCartInput,
  MakeAnOrderInput,
  UpdateProductInCartInput,
  useAddProductToCartMutation,
  useAddShoplessProductToCartMutation,
  useAddShopToCartProductMutation,
  useClearCartMutation,
  useDeleteProductFromCartMutation,
  useMakeAnOrderMutation,
  useRepeatAnOrderMutation,
  useUpdateProductInCartMutation,
} from 'generated/apolloComponents';
import { SESSION_CART_QUERY } from 'graphql/query/initialQueries';
import useSessionCity from 'hooks/useSessionCity';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface UseCartMutationsPayloadInterface {
  addProductToCart: (input: AddProductToCartInput) => void;
  addShoplessProductToCart: (input: AddShoplessProductToCartInput) => void;
  addShopToCartProduct: (input: AddShopToCartProductInput) => void;
  updateProductInCart: (input: UpdateProductInCartInput) => void;
  deleteProductFromCart: (input: DeleteProductFromCartInput) => void;
  makeAnOrder: (input: MakeAnOrderInput) => void;
  repeatAnOrder: (_id: string) => void;
  clearCart: () => void;
}

const useCartMutations = (): UseCartMutationsPayloadInterface => {
  const router = useRouter();
  const city = useSessionCity();
  const { showModal } = useAppContext();
  const { showErrorNotification, showSuccessNotification } = useNotificationsContext();

  const refetchConfig = React.useMemo(() => {
    return {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: SESSION_CART_QUERY }],
    };
  }, []);

  const [addProductToCartMutation] = useAddProductToCartMutation({
    ...refetchConfig,
    onCompleted: () => {
      showModal<CartModalInterface>({
        variant: CART_MODAL,
      });
    },
  });

  const [addShoplessProductToCartMutation] = useAddShoplessProductToCartMutation({
    ...refetchConfig,
    onCompleted: () => {
      showModal<CartModalInterface>({
        variant: CART_MODAL,
      });
    },
  });

  const [addShopToCartProductMutation] = useAddShopToCartProductMutation({
    ...refetchConfig,
  });

  const [updateProductInCartMutation] = useUpdateProductInCartMutation({
    ...refetchConfig,
  });

  const [deleteProductFromCartMutation] = useDeleteProductFromCartMutation({
    ...refetchConfig,
  });

  const [clearCartMutation] = useClearCartMutation({
    ...refetchConfig,
    onCompleted: ({ clearCart }) => {
      showSuccessNotification(clearCart);
    },
  });

  const [makeAnOrderMutation] = useMakeAnOrderMutation({
    ...refetchConfig,
    onCompleted: ({ makeAnOrder }) => {
      const { order } = makeAnOrder;
      router.push(`/${city}/thank-you?orderId=${order?.itemId}`).catch(() => {
        showErrorNotification();
      });
    },
  });

  const [repeatAnOrderMutation] = useRepeatAnOrderMutation({
    ...refetchConfig,
    onCompleted: () => {
      showModal<CartModalInterface>({
        variant: CART_MODAL,
        props: {
          title: `Товары из заказа добавлены в корзину`,
        },
      });
    },
  });

  const addProductToCart = React.useCallback(
    (input: AddProductToCartInput) => {
      addProductToCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [addProductToCartMutation, showErrorNotification],
  );

  const addShoplessProductToCart = React.useCallback(
    (input: AddShoplessProductToCartInput) => {
      addShoplessProductToCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [addShoplessProductToCartMutation, showErrorNotification],
  );

  const addShopToCartProduct = React.useCallback(
    (input: AddShopToCartProductInput) => {
      addShopToCartProductMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [addShopToCartProductMutation, showErrorNotification],
  );

  const updateProductInCart = React.useCallback(
    (input: UpdateProductInCartInput) => {
      updateProductInCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [showErrorNotification, updateProductInCartMutation],
  );

  const deleteProductFromCart = React.useCallback(
    (input: DeleteProductFromCartInput) => {
      deleteProductFromCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [deleteProductFromCartMutation, showErrorNotification],
  );

  const clearCart = React.useCallback(() => {
    clearCartMutation().catch(() => {
      showErrorNotification();
    });
  }, [clearCartMutation, showErrorNotification]);

  const makeAnOrder = React.useCallback(
    (input: MakeAnOrderInput) => {
      makeAnOrderMutation({
        variables: {
          input,
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [makeAnOrderMutation, showErrorNotification],
  );

  const repeatAnOrder = React.useCallback(
    (_id: string) => {
      repeatAnOrderMutation({
        variables: {
          input: {
            orderId: _id,
          },
        },
      }).catch(() => {
        showErrorNotification();
      });
    },
    [repeatAnOrderMutation, showErrorNotification],
  );

  return {
    addProductToCart,
    addShoplessProductToCart,
    addShopToCartProduct,
    updateProductInCart,
    deleteProductFromCart,
    clearCart,
    makeAnOrder,
    repeatAnOrder,
  };
};

export default useCartMutations;
