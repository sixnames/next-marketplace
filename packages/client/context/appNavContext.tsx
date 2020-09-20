import { InitialQuery } from '../generated/apolloComponents';
import React, { createContext, useContext, useMemo } from 'react';

export type NavItemType = InitialQuery['getSessionRole']['appNavigation'][0];

interface AppNavContextInterface {
  navItems: NavItemType[];
}

const AppNavContext = createContext<AppNavContextInterface>({
  navItems: [],
});

const AppNavContextProvider: React.FC<AppNavContextInterface> = ({ navItems, children }) => {
  const initialValue = useMemo(() => {
    return {
      navItems,
    };
  }, [navItems]);

  return <AppNavContext.Provider value={initialValue}>{children}</AppNavContext.Provider>;
};

function useAppNavContext() {
  const context = useContext<AppNavContextInterface>(AppNavContext);

  if (!context) {
    throw new Error('useAppNavContext must be used within a AppNavContextProvider');
  }

  return context;
}

export { AppNavContextProvider, useAppNavContext };
