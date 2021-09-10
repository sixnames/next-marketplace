import { CartModalInterface } from 'components/Modal/CartModal';
import { REQUEST_METHOD_POST, ROUTE_THANK_YOU } from 'config/common';
import { CART_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { MakeAnOrderInputInterface, MakeAnOrderPayloadModel } from 'db/dao/order/makeAnOrder';
import { CartInterface, CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import {
  AddProductToCartInput,
  AddShoplessProductToCartInput,
  AddShopToCartProductInput,
  DeleteProductFromCartInput,
  UpdateProductInCartInput,
  useAddProductToCartMutation,
  useAddShoplessProductToCartMutation,
  useAddShopToCartProductMutation,
  useClearCartMutation,
  useDeleteProductFromCartMutation,
  useRepeatAnOrderMutation,
  useUpdateProductInCartMutation,
} from 'generated/apolloComponents';
import { useMutation } from 'hooks/mutations/useFetch';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';

interface SiteContextStateInterface {
  loadingCart: boolean;
  cart?: CartInterface | null;
}

interface SiteContextInterface extends SiteContextStateInterface {
  navRubrics: RubricInterface[];
  addProductToCart: (input: AddProductToCartInput) => void;
  addShoplessProductToCart: (input: AddShoplessProductToCartInput) => void;
  addShopToCartProduct: (input: AddShopToCartProductInput) => void;
  updateProductInCart: (input: UpdateProductInCartInput) => void;
  deleteProductFromCart: (input: DeleteProductFromCartInput) => void;
  getShopProductInCartCount: (shopProductId: string) => number;
  makeAnOrder: (input: MakeAnOrderInputInterface) => void;
  repeatAnOrder: (_id: string) => void;
  clearCart: () => void;
}

const SiteContext = React.createContext<SiteContextInterface>({
  navRubrics: [],
  loadingCart: true,
  cart: null,
  addProductToCart: () => undefined,
  addShoplessProductToCart: () => undefined,
  addShopToCartProduct: () => undefined,
  updateProductInCart: () => undefined,
  deleteProductFromCart: () => undefined,
  getShopProductInCartCount: () => 0,
  makeAnOrder: () => undefined,
  repeatAnOrder: () => undefined,
  clearCart: () => undefined,
});

interface SiteContextProviderInterface {
  navRubrics: RubricInterface[];
  sessionCity: string;
  company?: CompanyInterface | null;
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  sessionCity,
  navRubrics,
  company,
}) => {
  const router = useRouter();
  const { showModal, showLoading, hideLoading } = useAppContext();
  const { showErrorNotification, showSuccessNotification } = useNotificationsContext();
  const [state, setState] = React.useState<SiteContextStateInterface>({
    loadingCart: false,
    cart: null,
  });

  const refetchCartHandler = React.useCallback(
    (callback?: () => void) => {
      setState((prevState) => {
        return {
          ...prevState,
          loadingCart: true,
        };
      });
      fetch(
        `/api/session-cart?locale=${router.locale}&city=${sessionCity}${
          company ? `&companyId=${company._id}` : ''
        }`,
      )
        .then((res) => res.json())
        .then((data) => {
          setState((prevState) => {
            return {
              ...prevState,
              loadingCart: false,
              cart: data.sessionCart,
            };
          });
          hideLoading();
          if (callback) {
            callback();
          }
        })
        .catch((e) => {
          console.log(e);
          setState((prevState) => {
            return {
              ...prevState,
              loadingCart: false,
              cart: null,
            };
          });
        });
    },
    [company, router.locale, sessionCity, hideLoading],
  );

  React.useEffect(() => {
    if (!state.cart && !state.loadingCart) {
      refetchCartHandler();
    }
  }, [refetchCartHandler, state]);

  const [addProductToCartMutation] = useAddProductToCartMutation({
    onCompleted: () => {
      refetchCartHandler(() => {
        showModal<CartModalInterface>({
          variant: CART_MODAL,
        });
      });
    },
  });

  const [addShoplessProductToCartMutation] = useAddShoplessProductToCartMutation({
    onCompleted: () => {
      refetchCartHandler(() => {
        showModal<CartModalInterface>({
          variant: CART_MODAL,
        });
      });
    },
  });

  const [addShopToCartProductMutation] = useAddShopToCartProductMutation({
    onCompleted: () => {
      refetchCartHandler();
    },
  });

  const [updateProductInCartMutation] = useUpdateProductInCartMutation({
    onCompleted: () => {
      refetchCartHandler();
    },
  });

  const [deleteProductFromCartMutation] = useDeleteProductFromCartMutation({
    onCompleted: () => {
      refetchCartHandler();
    },
  });

  const [clearCartMutation] = useClearCartMutation({
    onCompleted: ({ clearCart }) => {
      refetchCartHandler(() => {
        showSuccessNotification(clearCart);
      });
    },
  });

  const [makeAnOrderMutation] = useMutation<MakeAnOrderPayloadModel>({
    input: '/api/order/make',
    onSuccess: (payload) => {
      if (payload.success) {
        refetchCartHandler();
        router.push(ROUTE_THANK_YOU).catch(console.log);
        return;
      }
      hideLoading();
      showErrorNotification({ title: payload.message });
    },
  });

  const [repeatAnOrderMutation] = useRepeatAnOrderMutation({
    onCompleted: () => {
      refetchCartHandler(() => {
        showModal<CartModalInterface>({
          variant: CART_MODAL,
          props: {
            title: `Товары из заказа добавлены в корзину`,
          },
        });
      });
    },
  });

  const addProductToCart = React.useCallback(
    (input: AddProductToCartInput) => {
      showLoading();
      addProductToCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        hideLoading();
        showErrorNotification();
      });
    },
    [addProductToCartMutation, hideLoading, showErrorNotification, showLoading],
  );

  const addShoplessProductToCart = React.useCallback(
    (input: AddShoplessProductToCartInput) => {
      showLoading();
      addShoplessProductToCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        hideLoading();
        showErrorNotification();
      });
    },
    [addShoplessProductToCartMutation, hideLoading, showErrorNotification, showLoading],
  );

  const addShopToCartProduct = React.useCallback(
    (input: AddShopToCartProductInput) => {
      showLoading();
      addShopToCartProductMutation({
        variables: {
          input,
        },
      }).catch(() => {
        hideLoading();
        showErrorNotification();
      });
    },
    [addShopToCartProductMutation, hideLoading, showErrorNotification, showLoading],
  );

  const updateProductInCart = React.useCallback(
    (input: UpdateProductInCartInput) => {
      showLoading();
      updateProductInCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        hideLoading();
        showErrorNotification();
      });
    },
    [hideLoading, showErrorNotification, showLoading, updateProductInCartMutation],
  );

  const deleteProductFromCart = React.useCallback(
    (input: DeleteProductFromCartInput) => {
      showLoading();
      deleteProductFromCartMutation({
        variables: {
          input,
        },
      }).catch(() => {
        hideLoading();
        showErrorNotification();
      });
    },
    [deleteProductFromCartMutation, hideLoading, showErrorNotification, showLoading],
  );

  const clearCart = React.useCallback(() => {
    showLoading();
    clearCartMutation().catch(() => {
      showErrorNotification();
    });
  }, [clearCartMutation, showErrorNotification, showLoading]);

  const makeAnOrder = React.useCallback(
    (input: MakeAnOrderInputInterface) => {
      showLoading();
      makeAnOrderMutation({
        method: REQUEST_METHOD_POST,
        body: JSON.stringify(input),
      }).catch(() => {
        hideLoading();
        showErrorNotification();
      });
    },
    [hideLoading, makeAnOrderMutation, showErrorNotification, showLoading],
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
        hideLoading();
        showErrorNotification();
      });
    },
    [hideLoading, repeatAnOrderMutation, showErrorNotification],
  );

  const getShopProductInCartCount = React.useCallback(
    (shopProductId: string) => {
      const currentProduct = state.cart?.cartProducts.find((cartProduct) => {
        return `${cartProduct.shopProductId}` === shopProductId;
      });
      if (!currentProduct) {
        return 0;
      }
      return noNaN(currentProduct?.amount);
    },
    [state.cart],
  );

  const initialValue = React.useMemo(() => {
    return {
      navRubrics,
      addProductToCart,
      addShoplessProductToCart,
      addShopToCartProduct,
      updateProductInCart,
      deleteProductFromCart,
      clearCart,
      makeAnOrder,
      repeatAnOrder,
      getShopProductInCartCount,
      ...state,
    };
  }, [
    addProductToCart,
    addShopToCartProduct,
    addShoplessProductToCart,
    clearCart,
    deleteProductFromCart,
    getShopProductInCartCount,
    makeAnOrder,
    navRubrics,
    repeatAnOrder,
    state,
    updateProductInCart,
  ]);

  return <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>;
};

function useSiteContext() {
  const context = React.useContext<SiteContextInterface>(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  return context;
}

export { SiteContextProvider, useSiteContext };
