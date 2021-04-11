import { CartModalInterface } from 'components/Modal/CartModal/CartModal';
import { CART_MODAL } from 'config/modals';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { CartModel, CompanyModel, RubricModel } from 'db/dbModels';
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
import { useRouter } from 'next/router';
import * as React from 'react';

interface SiteContextStateInterface {
  loadingCart: boolean;
  cart?: CartModel | null;
}

interface SiteContextInterface extends SiteContextStateInterface {
  navRubrics: RubricModel[];
  addProductToCart: (input: AddProductToCartInput) => void;
  addShoplessProductToCart: (input: AddShoplessProductToCartInput) => void;
  addShopToCartProduct: (input: AddShopToCartProductInput) => void;
  updateProductInCart: (input: UpdateProductInCartInput) => void;
  deleteProductFromCart: (input: DeleteProductFromCartInput) => void;
  makeAnOrder: (input: MakeAnOrderInput) => void;
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
  makeAnOrder: () => undefined,
  repeatAnOrder: () => undefined,
  clearCart: () => undefined,
});

interface SiteContextProviderInterface {
  navRubrics: RubricModel[];
  sessionCity: string;
  company?: CompanyModel | null;
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  sessionCity,
  navRubrics,
  company,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const { showErrorNotification, showSuccessNotification } = useNotificationsContext();
  const [state, setState] = React.useState<SiteContextStateInterface>({
    loadingCart: true,
    cart: null,
  });

  const refetchCartHandler = React.useCallback(() => {
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
  }, [router]);

  React.useEffect(() => {
    if (!state.cart) {
      refetchCartHandler();
    }
  }, [refetchCartHandler, state.cart]);

  const [addProductToCartMutation] = useAddProductToCartMutation({
    onCompleted: () => {
      refetchCartHandler();
      showModal<CartModalInterface>({
        variant: CART_MODAL,
      });
    },
  });

  const [addShoplessProductToCartMutation] = useAddShoplessProductToCartMutation({
    onCompleted: () => {
      refetchCartHandler();
      showModal<CartModalInterface>({
        variant: CART_MODAL,
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
      refetchCartHandler();
      showSuccessNotification(clearCart);
    },
  });

  const [makeAnOrderMutation] = useMakeAnOrderMutation({
    onCompleted: ({ makeAnOrder }) => {
      refetchCartHandler();
      router.push(`/thank-you?orderId=${makeAnOrder.order?.itemId}`).catch(() => {
        showErrorNotification();
      });
    },
  });

  const [repeatAnOrderMutation] = useRepeatAnOrderMutation({
    onCompleted: () => {
      refetchCartHandler();
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
      ...state,
    };
  }, [
    addProductToCart,
    addShopToCartProduct,
    addShoplessProductToCart,
    clearCart,
    deleteProductFromCart,
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
