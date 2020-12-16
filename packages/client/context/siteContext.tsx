import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  AddProductToCartInput,
  AddShoplessProductToCartInput,
  AddShopToCartProductInput,
  CartFragment,
  CartPayloadFragment,
  DeleteProductFromCartInput,
  InitialSiteQueryQuery,
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
  useUpdateProductInCartMutation,
} from '../generated/apolloComponents';
import useMutationCallbacks from '../hooks/useMutationCallbacks';
import { CART_MODAL } from '../config/modals';
import { useRouter } from 'next/router';
import { CartModalInterface } from '../components/Modal/CartModal/CartModal';

export type RubricType = InitialSiteQueryQuery['getRubricsTree'][number];

export interface StickyNavAttributeInterface {
  attribute: RubricType['catalogueFilter']['attributes'][number];
  rubricSlug: string;
  hideDropdownHandler: () => void;
  isDropdownOpen: boolean;
}

interface SiteContextStateInterface {
  isBurgerDropdownOpen: boolean;
  isSearchOpen: boolean;
  cart: CartFragment;
}

interface SiteContextInterface extends SiteContextStateInterface {
  getRubricsTree: InitialSiteQueryQuery['getRubricsTree'];
  setState: React.Dispatch<React.SetStateAction<SiteContextStateInterface>>;
}

const initialCart: CartFragment = {
  id: 'cart',
  products: [],
  formattedTotalPrice: '',
  productsCount: 0,
  isWithShopless: false,
};

const SiteContext = createContext<SiteContextInterface>({
  getRubricsTree: [],
  isBurgerDropdownOpen: false,
  isSearchOpen: false,
  cart: initialCart,
  setState: () => null,
});

interface SiteContextProviderInterface {
  initialApolloState: InitialSiteQueryQuery;
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  initialApolloState,
}) => {
  const [state, setState] = useState<SiteContextStateInterface>(() => ({
    isBurgerDropdownOpen: false,
    isSearchOpen: false,
    cart: initialApolloState.getSessionCart,
    lastOrderItemId: null,
  }));

  const initialValue = useMemo(() => {
    return {
      getRubricsTree: initialApolloState.getRubricsTree || [],
      setState,
      ...state,
    };
  }, [initialApolloState, state]);

  return <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>;
};

interface CartContextUpdaterInterface {
  payload?: CartPayloadFragment | MakeAnOrderPayloadFragment | null;
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
  repeatAnOrder: (id: string) => void;
  clearCart: () => void;
  fixBodyScroll: (fixed: boolean) => void;
}

function useSiteContext(): UseSiteContextInterface {
  const router = useRouter();
  const context = useContext<SiteContextInterface>(SiteContext);
  const { showErrorNotification, showModal, showSuccessNotification } = useMutationCallbacks();
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  // Cart mutations
  const cartContextUpdater = useCallback(
    ({ mutationCallback, payload }: CartContextUpdaterInterface) => {
      if (!payload) {
        showErrorNotification();
        return;
      }

      // Update context
      const { cart, success } = payload;

      if (cart && success) {
        context.setState({
          isSearchOpen: false,
          isBurgerDropdownOpen: false,
          cart,
        });

        if (mutationCallback) {
          mutationCallback();
        }
        return;
      }
      showErrorNotification();
    },
    [context, showErrorNotification],
  );

  const [addProductToCartMutation] = useAddProductToCartMutation({
    onCompleted: ({ addProductToCart }) => {
      cartContextUpdater({
        payload: addProductToCart,
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
        payload: addShoplessProductToCart,
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
        payload: addShopToCartProduct,
      });
    },
  });

  const [updateProductInCartMutation] = useUpdateProductInCartMutation({
    onCompleted: ({ updateProductInCart }) => {
      cartContextUpdater({
        payload: updateProductInCart,
      });
    },
  });

  const [deleteProductFromCartMutation] = useDeleteProductFromCartMutation({
    onCompleted: ({ deleteProductFromCart }) => {
      cartContextUpdater({
        payload: deleteProductFromCart,
      });
    },
  });

  const [clearCartMutation] = useClearCartMutation({
    onCompleted: ({ clearCart }) => {
      showSuccessNotification(clearCart);
      cartContextUpdater({
        payload: clearCart,
      });
    },
  });

  const [makeAnOrderMutation] = useMakeAnOrderMutation({
    onCompleted: ({ makeAnOrder }) => {
      const { order } = makeAnOrder;
      cartContextUpdater({
        payload: makeAnOrder,
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
        payload: repeatOrder,
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

  const [bodyFixed, setBodyFixed] = useState<boolean>(false);

  const fixBodyScroll = useCallback((fixed: boolean) => {
    if (fixed) {
      const scrollY = window.scrollY;
      const paddingRight = window.innerWidth - document.body.clientWidth;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.paddingRight = `${paddingRight}px`;
      setBodyFixed(true);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      setBodyFixed(false);
    }
  }, []);

  const showBurgerDropdown = useCallback(() => {
    fixBodyScroll(true);
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: true,
    }));
  }, [context, fixBodyScroll]);

  const hideBurgerDropdown = useCallback(() => {
    if (bodyFixed) {
      fixBodyScroll(false);
    }
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: false,
    }));
  }, [bodyFixed, context, fixBodyScroll]);

  const toggleBurgerDropdown = useCallback(() => {
    context.setState((prevState) => {
      fixBodyScroll(!prevState.isBurgerDropdownOpen);

      return {
        ...prevState,
        isSearchOpen: false,
        isBurgerDropdownOpen: !prevState.isBurgerDropdownOpen,
      };
    });
  }, [context, fixBodyScroll]);

  const showSearchDropdown = useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: true,
    }));
  }, [context]);

  const hideSearchDropdown = useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: false,
    }));
  }, [context]);

  const toggleSearchDropdown = useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: !prevState.isSearchOpen,
    }));
  }, [context]);

  const addProductToCart = useCallback(
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

  const addShoplessProductToCart = useCallback(
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

  const addShopToCartProduct = useCallback(
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

  const updateProductInCart = useCallback(
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

  const deleteProductFromCart = useCallback(
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

  const clearCart = useCallback(() => {
    clearCartMutation().catch(() => {
      showErrorNotification();
    });
  }, [clearCartMutation, showErrorNotification]);

  const makeAnOrder = useCallback(
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

  const repeatAnOrder = useCallback(
    (id: string) => {
      repeatAnOrderMutation({
        variables: {
          id,
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
