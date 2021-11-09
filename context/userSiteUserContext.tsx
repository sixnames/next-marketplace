import { ONE_MINUTE } from 'config/common';
import { SessionUserPayloadInterface } from 'db/dao/user/getPageSessionUser';
import * as React from 'react';
import useSWR from 'swr';

const SiteUserContext = React.createContext<SessionUserPayloadInterface | undefined | null>(null);

const SiteUserContextProvider: React.FC = ({ children }) => {
  const { data } = useSWR<SessionUserPayloadInterface>('/api/user/session', {
    refreshInterval: ONE_MINUTE,
  });

  const value = React.useMemo(() => {
    return data;
  }, [data]);

  return <SiteUserContext.Provider value={value}>{children}</SiteUserContext.Provider>;
};

function useSiteUserContext() {
  const context: SessionUserPayloadInterface | undefined | null = React.useContext(SiteUserContext);
  return context;
}

export { SiteUserContextProvider, useSiteUserContext };
