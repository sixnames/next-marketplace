import { RubricModel } from 'db/dbModels';
import * as React from 'react';
import {
  AddProductToCartInput,
  AddShoplessProductToCartInput,
  AddShopToCartProductInput,
  CartFragment,
  CartPayloadFragment,
  DeleteProductFromCartInput,
  MakeAnOrderInput,
  MakeAnOrderPayloadFragment,
  UpdateProductInCartInput,
  useAddProductToCartMutation,
  useAddShoplessProductToCartMutation,
  useAddShopToCartProductMutation,
  useClearCartMutation,
  useDeleteProductFromCartMutation,
  useMakeAnOrderMutation,
  useRepeatAnOrderMutation,
  useSessionCartQuery,
  useUpdateProductInCartMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from '../hooks/useMutationCallbacks';
import { CART_MODAL } from 'config/modals';
import { useRouter } from 'next/router';
import { CartModalInterface } from 'components/Modal/CartModal/CartModal';
import { useAppContext } from './appContext';

interface SiteContextStateInterface {
  isBurgerDropdownOpen: boolean;
  isSearchOpen: boolean;
  cart: CartFragment;
}

interface SiteContextInterface extends SiteContextStateInterface {
  catalogueNavRubrics: RubricModel[];
  setState: React.Dispatch<React.SetStateAction<SiteContextStateInterface>>;
}

const initialCart: CartFragment = {
  _id: 'cart',
  cartProducts: [],
  formattedTotalPrice: '',
  productsCount: 0,
  isWithShopless: false,
};

const SiteContext = React.createContext<SiteContextInterface>({
  catalogueNavRubrics: [],
  isBurgerDropdownOpen: false,
  isSearchOpen: false,
  cart: initialCart,
  setState: () => null,
});

interface SiteContextProviderInterface {
  catalogueNavRubrics: RubricModel[];
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  catalogueNavRubrics,
}) => {
  const { data } = useSessionCartQuery({ fetchPolicy: 'network-only' });
  const [state, setState] = React.useState<SiteContextStateInterface>(() => ({
    isBurgerDropdownOpen: false,
    isSearchOpen: false,
    cart: initialCart,
    lastOrderItemId: null,
  }));

  React.useEffect(() => {
    if (data && data.getSessionCart) {
      setState((prevState) => ({
        ...prevState,
        cart: data.getSessionCart,
      }));
    }
  }, [data]);

  const initialValue = React.useMemo(() => {
    return {
      catalogueNavRubrics,
      setState,
      ...state,
    };
  }, [catalogueNavRubrics, state]);

  return <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>;
};

interface CartContextUpdaterInterface {
  cartPayload?: CartPayloadFragment | null;
  orderPayload?: MakeAnOrderPayloadFragment | null;
  mutationCallback?: () => void;
}

interface UseSiteContextInterface extends SiteContextInterface {
  showBurgerDropdown: () => void;
  hideBurgerDropdown: () => void;
  toggleBurgerDropdown: () => void;
  showSearchDropdown: () => void;
  hideSearchDropdown: () => void;
  toggleSearchDropdown: () => void;
  addProductToCart: (input: AddProductToCartInput) => void;
  addShoplessProductToCart: (input: AddShoplessProductToCartInput) => void;
  addShopToCartProduct: (input: AddShopToCartProductInput) => void;
  updateProductInCart: (input: UpdateProductInCartInput) => void;
  deleteProductFromCart: (input: DeleteProductFromCartInput) => void;
  makeAnOrder: (input: MakeAnOrderInput) => void;
  repeatAnOrder: (_id: string) => void;
  clearCart: () => void;
  fixBodyScroll: (fixed: boolean) => void;
}

function useSiteContext(): UseSiteContextInterface {
  const { isMobile } = useAppContext();
  const router = useRouter();
  const context = React.useContext<SiteContextInterface>(SiteContext);
  const { showErrorNotification, showModal, showSuccessNotification } = useMutationCallbacks();
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  // Cart mutations
  const cartContextUpdater = React.useCallback(
    ({ mutationCallback, cartPayload, orderPayload }: CartContextUpdaterInterface) => {
      // Update context
      if ((cartPayload && cartPayload?.success) || (orderPayload && orderPayload.success)) {
        if (mutationCallback) {
          mutationCallback();
        }

        context.setState({
          isSearchOpen: false,
          isBurgerDropdownOpen: false,
          cart: cartPayload?.payload || orderPayload?.cart || initialCart,
        });

        return;
      }
      showErrorNotification();
    },
    [context, showErrorNotification],
  );

  const [addProductToCartMutation] = useAddProductToCartMutation({
    onCompleted: ({ addProductToCart }) => {
      cartContextUpdater({
        cartPayload: addProductToCart,
        mutationCallback: () => {
          // Show cart modal
          showModal<CartModalInterface>({
            variant: CART_MODAL,
          });
        },
      });
    },
  });

  const [addShoplessProductToCartMutation] = useAddShoplessProductToCartMutation({
    onCompleted: ({ addShoplessProductToCart }) => {
      cartContextUpdater({
        cartPayload: addShoplessProductToCart,
        mutationCallback: () => {
          // Show cart modal
          showModal<CartModalInterface>({
            variant: CART_MODAL,
          });
        },
      });
    },
  });

  const [addShopToCartProductMutation] = useAddShopToCartProductMutation({
    onCompleted: ({ addShopToCartProduct }) => {
      cartContextUpdater({
        cartPayload: addShopToCartProduct,
      });
    },
  });

  const [updateProductInCartMutation] = useUpdateProductInCartMutation({
    onCompleted: ({ updateProductInCart }) => {
      cartContextUpdater({
        cartPayload: updateProductInCart,
      });
    },
  });

  const [deleteProductFromCartMutation] = useDeleteProductFromCartMutation({
    onCompleted: ({ deleteProductFromCart }) => {
      cartContextUpdater({
        cartPayload: deleteProductFromCart,
      });
    },
  });

  const [clearCartMutation] = useClearCartMutation({
    onCompleted: ({ clearCart }) => {
      showSuccessNotification(clearCart);
      cartContextUpdater({
        cartPayload: clearCart,
      });
    },
  });

  const [makeAnOrderMutation] = useMakeAnOrderMutation({
    onCompleted: ({ makeAnOrder }) => {
      const { order } = makeAnOrder;
      cartContextUpdater({
        orderPayload: makeAnOrder,
        mutationCallback: () => {
          router.push(`/thank-you?orderId=${order?.itemId}`).catch(() => {
            showErrorNotification();
          });
        },
      });
    },
  });

  const [repeatAnOrderMutation] = useRepeatAnOrderMutation({
    onCompleted: ({ repeatOrder }) => {
      cartContextUpdater({
        cartPayload: repeatOrder,
        mutationCallback: () => {
          // Show cart modal
          showModal<CartModalInterface>({
            variant: CART_MODAL,
            props: {
              title: `Товары из заказа добавлены в корзину`,
            },
          });
        },
      });
    },
  });

  const fixBodyScroll = React.useCallback((fixed: boolean) => {
    if (fixed) {
      const scrollY = window.scrollY;
      const paddingRight = window.innerWidth - document.body.clientWidth;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.paddingRight = `${paddingRight}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, []);

  const showBurgerDropdown = React.useCallback(() => {
    fixBodyScroll(true);
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: true,
    }));
  }, [context, fixBodyScroll]);

  const hideBurgerDropdown = React.useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: false,
    }));
  }, [context, fixBodyScroll]);

  const toggleBurgerDropdown = React.useCallback(() => {
    context.setState((prevState) => {
      fixBodyScroll(!prevState.isBurgerDropdownOpen);

      return {
        ...prevState,
        isSearchOpen: false,
        isBurgerDropdownOpen: !prevState.isBurgerDropdownOpen,
      };
    });
  }, [context, fixBodyScroll]);

  const showSearchDropdown = React.useCallback(() => {
    if (isMobile) {
      fixBodyScroll(true);
    }
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: true,
    }));
  }, [context, fixBodyScroll, isMobile]);

  const hideSearchDropdown = React.useCallback(() => {
    fixBodyScroll(false);
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: false,
    }));
  }, [context, fixBodyScroll]);

  const toggleSearchDropdown = React.useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: !prevState.isSearchOpen,
    }));
  }, [context]);

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
    ...context,
    fixBodyScroll,
    showBurgerDropdown,
    hideBurgerDropdown,
    toggleBurgerDropdown,
    showSearchDropdown,
    hideSearchDropdown,
    toggleSearchDropdown,
    addProductToCart,
    addShoplessProductToCart,
    addShopToCartProduct,
    updateProductInCart,
    deleteProductFromCart,
    clearCart,
    makeAnOrder,
    repeatAnOrder,
  };
}

export { SiteContextProvider, useSiteContext };
