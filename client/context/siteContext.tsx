import React, { createContext, useContext, useMemo } from 'react';
import { InitialSiteQueryQuery } from '../generated/apolloComponents';
import { DEFAULT_LANG } from '../config';
import { UserContextProvider } from './userContext';

interface SiteContextInterface {
  getRubricsTree: InitialSiteQueryQuery['getRubricsTree'];
  lang: string;
}

const SiteContext = createContext<SiteContextInterface>({
  getRubricsTree: [],
  lang: DEFAULT_LANG,
});

interface SiteContextProviderInterface {
  initialApolloState: InitialSiteQueryQuery;
  lang: string;
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({
  children,
  initialApolloState,
  lang,
}) => {
  const initialValue = useMemo(() => {
    return {
      getRubricsTree: initialApolloState.getRubricsTree || [],
      lang,
    };
  }, [initialApolloState, lang]);

  return (
    <UserContextProvider me={initialApolloState.me}>
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
        lang: DEFAULT_LANG,
      };
}

export { SiteContextProvider, useSiteContext };
