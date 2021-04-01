import { ApolloQueryResult } from '@apollo/client';
import * as React from 'react';
import {
  SessionUserFragment,
  SessionUserQuery,
  useSessionUserQuery,
} from 'generated/apolloComponents';

interface ContextState {
  me?: SessionUserFragment | null;
  loadingUser: boolean;
}

interface UserContextInterface {
  state: ContextState;
  setState?: any;
  refetch?: () => Promise<ApolloQueryResult<SessionUserQuery>>;
}

const UserContext = React.createContext<UserContextInterface>({
  state: {
    loadingUser: true,
  },
});

const UserContextProvider: React.FC = ({ children }) => {
  const { data, loading, refetch } = useSessionUserQuery({ fetchPolicy: 'network-only' });
  const [state, setState] = React.useState<ContextState>(() => {
    return {
      me: null,
      loadingUser: true,
    };
  });

  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      me: data?.me,
      loadingUser: loading,
    }));
  }, [data, loading]);

  const value = React.useMemo(() => {
    return {
      state,
      setState,
      refetch,
    };
  }, [refetch, state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

function useUserContext() {
  const context: UserContextInterface = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
}

export { UserContextProvider, useUserContext };
