import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  AddProductToCartInput,
  InitialSiteQueryQuery,
  useAddProductToCartMutation,
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

const initialCart = {
  id: 'cart',
  products: [],
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

interface UseSiteContextInterface extends SiteContextInterface {
  showBurgerDropdown: () => void;
  hideBurgerDropdown: () => void;
  toggleBurgerDropdown: () => void;
  showSearchDropdown: () => void;
  hideSearchDropdown: () => void;
  toggleSearchDropdown: () => void;
  addProductToCart: (input: AddProductToCartInput) => void;
}

function useSiteContext(): UseSiteContextInterface {
  const context = useContext<SiteContextInterface>(SiteContext);
  const { showErrorNotification, showModal } = useMutationCallbacks();
  const [addProductToCartMutation] = useAddProductToCartMutation({
    onCompleted: ({ addProductToCart }) => {
      // Update context
      if (addProductToCart?.cart && addProductToCart?.success) {
        context.setState({
          isSearchOpen: false,
          isBurgerDropdownOpen: false,
          cart: addProductToCart.cart,
        });

        // Show cart modal
        showModal({
          type: CART_MODAL,
        });
        return;
      }
      showErrorNotification({});
    },
  });

  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  const { setState } = context;

  function showBurgerDropdown() {
    setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: true,
    }));
  }

  function hideBurgerDropdown() {
    setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: false,
    }));
  }

  function toggleBurgerDropdown() {
    setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: !prevState.isBurgerDropdownOpen,
    }));
  }

  function showSearchDropdown() {
    setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: true,
    }));
  }

  function hideSearchDropdown() {
    setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: false,
    }));
  }

  function toggleSearchDropdown() {
    setState((prevState) => ({
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
      showErrorNotification({});
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
  };
}

export { SiteContextProvider, useSiteContext };
