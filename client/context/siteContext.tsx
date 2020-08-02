import React, { createContext, useContext, useMemo } from 'react';
import { InitialSiteQueryQuery } from '../generated/apolloComponents';
import { UserContextProvider } from './userContext';

interface SiteContextInterface {
  getRubricsTree: InitialSiteQueryQuery['getRubricsTree'];
}

const SiteContext = createContext<SiteContextInterface>({
  getRubricsTree: [],
});

interface SiteContextProviderInterface {
  initialApolloState: InitialSiteQueryQuery;
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  initialApolloState,
}) => {
  const initialValue = useMemo(() => {
    return {
      getRubricsTree: initialApolloState.getRubricsTree || [],
    };
  }, [initialApolloState]);

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
  const context = useContext(SiteContext) || {
    getRubricsTree: [],
    getAllConfigs: [],
  };

  return {
    ...context,
  };
}

export { SiteContextProvider, useSiteContext };
