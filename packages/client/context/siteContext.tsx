import React, { createContext, useContext, useMemo, useState } from 'react';
import { InitialSiteQueryQuery } from '../generated/apolloComponents';
import { UserContextProvider } from './userContext';
import { DEFAULT_CURRENCY } from '@yagu/config';

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
}

interface SiteContextInterface extends SiteContextStateInterface {
  getRubricsTree: InitialSiteQueryQuery['getRubricsTree'];
  currency: string;
  setState: any;
}

const SiteContext = createContext<SiteContextInterface>({
  getRubricsTree: [],
  currency: DEFAULT_CURRENCY,
  isBurgerDropdownOpen: false,
  isSearchOpen: false,
  setState: () => null,
});

interface SiteContextProviderInterface {
  initialApolloState: InitialSiteQueryQuery;
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  initialApolloState,
}) => {
  const [state, setState] = useState({
    isBurgerDropdownOpen: false,
    isSearchOpen: false,
  });

  const initialValue = useMemo(() => {
    return {
      getRubricsTree: initialApolloState.getRubricsTree || [],
      currency: initialApolloState.getSessionCurrency,
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
      languagesList={initialApolloState.getAllLanguages || []}
    >
      <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>
    </UserContextProvider>
  );
};

function useSiteContext() {
  const context = useContext<SiteContextInterface>(SiteContext);

  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  const { setState } = context;

  function showBurgerDropdown() {
    setState((prevState: SiteContextStateInterface) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: true,
    }));
  }

  function hideBurgerDropdown() {
    setState((prevState: SiteContextStateInterface) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: false,
    }));
  }

  function toggleBurgerDropdown() {
    setState((prevState: SiteContextStateInterface) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: !prevState.isBurgerDropdownOpen,
    }));
  }

  function showSearchDropdown() {
    setState((prevState: SiteContextStateInterface) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: true,
    }));
  }

  function hideSearchDropdown() {
    setState((prevState: SiteContextStateInterface) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: false,
    }));
  }

  function toggleSearchDropdown() {
    setState((prevState: SiteContextStateInterface) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: !prevState.isSearchOpen,
    }));
  }

  return {
    ...context,
    showBurgerDropdown,
    hideBurgerDropdown,
    toggleBurgerDropdown,
    showSearchDropdown,
    hideSearchDropdown,
    toggleSearchDropdown,
  };
}

export { SiteContextProvider, useSiteContext };
