import { RubricModel } from 'db/dbModels';
import * as React from 'react';

interface SiteContextStateInterface {
  isSearchOpen: boolean;
}

interface SiteContextInterface extends SiteContextStateInterface {
  navRubrics: RubricModel[];
  setState: React.Dispatch<React.SetStateAction<SiteContextStateInterface>>;
}

const SiteContext = React.createContext<SiteContextInterface>({
  navRubrics: [],
  isSearchOpen: false,
  setState: () => null,
});

interface SiteContextProviderInterface {
  navRubrics: RubricModel[];
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({ children, navRubrics }) => {
  const [state, setState] = React.useState<SiteContextStateInterface>(() => ({
    isSearchOpen: false,
    loadingCart: true,
    lastOrderItemId: null,
  }));

  const initialValue = React.useMemo(() => {
    return {
      navRubrics,
      setState,
      ...state,
    };
  }, [navRubrics, state]);

  return <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>;
};

interface UseSiteContextInterface extends SiteContextInterface {
  showSearchDropdown: () => void;
  hideSearchDropdown: () => void;
  toggleSearchDropdown: () => void;
}

function useSiteContext(): UseSiteContextInterface {
  const context = React.useContext<SiteContextInterface>(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  const showSearchDropdown = React.useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: true,
    }));
  }, [context]);

  const hideSearchDropdown = React.useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: false,
    }));
  }, [context]);

  const toggleSearchDropdown = React.useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isBurgerDropdownOpen: false,
      isSearchOpen: !prevState.isSearchOpen,
    }));
  }, [context]);

  return {
    ...context,
    showSearchDropdown,
    hideSearchDropdown,
    toggleSearchDropdown,
  };
}

export { SiteContextProvider, useSiteContext };
