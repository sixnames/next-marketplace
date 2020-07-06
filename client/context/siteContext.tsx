import React, { createContext, useContext, useMemo } from 'react';
import { InitialSiteQueryQueryResult } from '../generated/apolloComponents';

const SiteContext = createContext<InitialSiteQueryQueryResult['data']>({
  getRubricsTree: [],
});

interface SiteContextProviderInterface {
  value: InitialSiteQueryQueryResult['data'];
}

const SiteContextProvider: React.FC<SiteContextProviderInterface> = ({ children, value }) => {
  const initialValue = useMemo(() => {
    return value;
  }, [value]);
  return <SiteContext.Provider value={initialValue}>{children}</SiteContext.Provider>;
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
