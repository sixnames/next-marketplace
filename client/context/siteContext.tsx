import React, { createContext, useContext, useMemo, useState } from 'react';
import { InitialSiteQueryQuery } from '../generated/apolloComponents';
import { UserContextProvider } from './userContext';

interface SiteContextStateInterface {
  isBurgerDropdownOpen: boolean;
}

interface SiteContextInterface extends SiteContextStateInterface {
  getRubricsTree: InitialSiteQueryQuery['getRubricsTree'];
  setState: any;
}

const SiteContext = createContext<SiteContextInterface>({
  getRubricsTree: [],
  isBurgerDropdownOpen: true,
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
  });

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
      lang={initialApolloState.getClientLanguage}
      configs={initialApolloState.getAllConfigs}
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
      isBurgerDropdownOpen: true,
    }));
  }

  function hideBurgerDropdown() {
    setState((prevState: SiteContextStateInterface) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
    }));
  }

  function toggleBurgerDropdown() {
    setState((prevState: SiteContextStateInterface) => ({
      ...prevState,
      isBurgerDropdownOpen: !prevState.isBurgerDropdownOpen,
    }));
  }

  return {
    ...context,
    showBurgerDropdown,
    hideBurgerDropdown,
    toggleBurgerDropdown,
  };
}

export { SiteContextProvider, useSiteContext };
