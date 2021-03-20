import { RubricModel } from 'db/dbModels';
import * as React from 'react';

interface SiteContextStateInterface {
  isBurgerDropdownOpen: boolean;
  isSearchOpen: boolean;
}

interface SiteContextInterface extends SiteContextStateInterface {
  navRubrics: RubricModel[];
  setState: React.Dispatch<React.SetStateAction<SiteContextStateInterface>>;
}

const SiteContext = React.createContext<SiteContextInterface>({
  navRubrics: [],
  isBurgerDropdownOpen: false,
  isSearchOpen: false,
  setState: () => null,
});

interface SiteContextProviderInterface {
  navRubrics: RubricModel[];
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({ children, navRubrics }) => {
  const [state, setState] = React.useState<SiteContextStateInterface>(() => ({
    isBurgerDropdownOpen: false,
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
  showBurgerDropdown: () => void;
  hideBurgerDropdown: () => void;
  toggleBurgerDropdown: () => void;
  showSearchDropdown: () => void;
  hideSearchDropdown: () => void;
  toggleSearchDropdown: () => void;
}

function useSiteContext(): UseSiteContextInterface {
  const context = React.useContext<SiteContextInterface>(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

  const showBurgerDropdown = React.useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: true,
    }));
  }, [context]);

  const hideBurgerDropdown = React.useCallback(() => {
    context.setState((prevState) => ({
      ...prevState,
      isSearchOpen: false,
      isBurgerDropdownOpen: false,
    }));
  }, [context]);

  const toggleBurgerDropdown = React.useCallback(() => {
    context.setState((prevState) => {
      return {
        ...prevState,
        isSearchOpen: false,
        isBurgerDropdownOpen: !prevState.isBurgerDropdownOpen,
      };
    });
  }, [context]);

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
    showBurgerDropdown,
    hideBurgerDropdown,
    toggleBurgerDropdown,
    showSearchDropdown,
    hideSearchDropdown,
    toggleSearchDropdown,
  };
}

export { SiteContextProvider, useSiteContext };
