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
      languagesList={initialApolloState.getAllLanguages || []}
    >
      <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>
    </UserContextProvider>
  );
};

function useSiteContext() {
  const context = useContext(SiteContext);
  return context
    ? context
    : {
        getRubricsTree: [],
      };
}

export { SiteContextProvider, useSiteContext };
