import { RubricModel } from 'db/dbModels';
import * as React from 'react';
import { useAppContext } from './appContext';

interface SiteContextStateInterface {
  isBurgerDropdownOpen: boolean;
  isSearchOpen: boolean;
}

interface SiteContextInterface extends SiteContextStateInterface {
  catalogueNavRubrics: RubricModel[];
  setState: React.Dispatch<React.SetStateAction<SiteContextStateInterface>>;
}

const SiteContext = React.createContext<SiteContextInterface>({
  catalogueNavRubrics: [],
  isBurgerDropdownOpen: false,
  isSearchOpen: false,
  setState: () => null,
});

interface SiteContextProviderInterface {
  catalogueNavRubrics: RubricModel[];
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  catalogueNavRubrics,
}) => {
  const [state, setState] = React.useState<SiteContextStateInterface>(() => ({
    isBurgerDropdownOpen: false,
    isSearchOpen: false,
    loadingCart: true,
    lastOrderItemId: null,
  }));

  const initialValue = React.useMemo(() => {
    return {
      catalogueNavRubrics,
      setState,
      ...state,
    };
  }, [catalogueNavRubrics, state]);

  return <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>;
};

interface UseSiteContextInterface extends SiteContextInterface {
  showBurgerDropdown: () => void;
  hideBurgerDropdown: () => void;
  toggleBurgerDropdown: () => void;
  showSearchDropdown: () => void;
  hideSearchDropdown: () => void;
  toggleSearchDropdown: () => void;
  fixBodyScroll: (fixed: boolean) => void;
}

function useSiteContext(): UseSiteContextInterface {
  const { isMobile } = useAppContext();
  const context = React.useContext<SiteContextInterface>(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }

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
  }, [context]);

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

  return {
    ...context,
    fixBodyScroll,
    showBurgerDropdown,
    hideBurgerDropdown,
    toggleBurgerDropdown,
    showSearchDropdown,
    hideSearchDropdown,
    toggleSearchDropdown,
  };
}

export { SiteContextProvider, useSiteContext };
