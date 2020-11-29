import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  AddProductToCartInput,
  AddShoplessProductToCartInput,
  AddShopToCartProductInput,
  CartFragment,
  CartPayloadFragment,
  DeleteProductFromCartInput,
  InitialSiteQueryQuery,
  UpdateProductInCartInput,
  useAddProductToCartMutation,
  useAddShoplessProductToCartMutation,
  useAddShopToCartProductMutation,
  useDeleteProductFromCartMutation,
  useUpdateProductInCartMutation,
} from '../generated/apolloComponents';
import { UserContextProvider } from './userContext';
import useMutationCallbacks from '../hooks/useMutationCallbacks';
import { CART_MODAL } from '../config/modals';

export type RubricType = InitialSiteQueryQuery['getRubricsTree'][number];

export interface StickyNavAttributeInterface {
  attribute: RubricType['filterAttributes'][number];
  rubricSlug: string;
  hideDropdownHandler: () => void;
  isDropdownOpen: boolean;
}

interface SiteContextStateInterface {
  isBurgerDropdownOpen: boolean;
  isSearchOpen: boolean;
  cart: InitialSiteQueryQuery['getSessionCart'];
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
  }));

  const initialValue = useMemo(() => {
    return {
      getRubricsTree: initialApolloState.getRubricsTree || [],
      setState,
      ...state,
    };
  }, [initialApolloState, state]);

  return (
    <UserContextProvider
      me={initialApolloState.me}
      cities={initialApolloState.getAllCities}
      configs={initialApolloState.getAllConfigs}
      lang={initialApolloState.getClientLanguage}
      currency={initialApolloState.getSessionCurrency}
      languagesList={initialApolloState.getAllLanguages || []}
    >
      <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>
    </UserContextProvider>
  );
};

interface CartContextUpdaterInterface {
  payload?: CartPayloadFragment | null;
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
}

function useSiteContext(): UseSiteContextInterface {
  const context = useContext<SiteContextInterface>(SiteContext);
  const { showErrorNotification, showModal } = useMutationCallbacks();

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
          showModal({
            type: CART_MODAL,
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
          showModal({
            type: CART_MODAL,
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

  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  function showBurgerDropdown() {
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: true,
    }));
  }

  function hideBurgerDropdown() {
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: false,
    }));
  }

  function toggleBurgerDropdown() {
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: !prevState.isBurgerDropdownOpen,
    }));
  }

  function showSearchDropdown() {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: true,
    }));
  }

  function hideSearchDropdown() {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: false,
    }));
  }

  function toggleSearchDropdown() {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: !prevState.isSearchOpen,
    }));
  }

  function addProductToCart(input: AddProductToCartInput) {
    addProductToCartMutation({
      variables: {
        input,
      },
    }).catch(() => {
      showErrorNotification();
    });
  }

  function addShoplessProductToCart(input: AddShoplessProductToCartInput) {
    addShoplessProductToCartMutation({
      variables: {
        input,
      },
    }).catch(() => {
      showErrorNotification();
    });
  }

  function addShopToCartProduct(input: AddShopToCartProductInput) {
    addShopToCartProductMutation({
      variables: {
        input,
      },
    }).catch(() => {
      showErrorNotification();
    });
  }

  function updateProductInCart(input: UpdateProductInCartInput) {
    updateProductInCartMutation({
      variables: {
        input,
      },
    }).catch(() => {
      showErrorNotification();
    });
  }

  function deleteProductFromCart(input: DeleteProductFromCartInput) {
    deleteProductFromCartMutation({
      variables: {
        input,
      },
    }).catch(() => {
      showErrorNotification();
    });
  }

  return {
    ...context,
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
  };
}

export { SiteContextProvider, useSiteContext };
