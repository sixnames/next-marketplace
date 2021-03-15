import * as React from 'react';
import { SessionUserFragment, useSessionUserQuery } from 'generated/apolloComponents';

interface ContextState {
  isAuthenticated: boolean;
  me?: SessionUserFragment | null;
  loadingUser: boolean;
}

interface UserContextInterface {
  state: ContextState;
  setState?: any;
}

const UserContext = React.createContext<UserContextInterface>({
  state: {
    isAuthenticated: false,
    loadingUser: true,
  },
});

const UserContextProvider: React.FC = ({ children }) => {
  const { data, loading } = useSessionUserQuery({ fetchPolicy: 'network-only' });
  const [state, setState] = React.useState<ContextState>(() => {
    return {
      me: null,
      isAuthenticated: false,
      loadingUser: true,
    };
  });

  React.useEffect(() => {
    if (data && data.me) {
      setState((prevState) => ({
        ...prevState,
        me: data.me,
        isAuthenticated: true,
        loadingUser: loading,
      }));
    }
  }, [data, loading]);

  const value = React.useMemo(() => {
    return {
      state,
      setState,
    };
  }, [state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// TODO add initial user for cms and app
function useUserContext() {
  const context: UserContextInterface = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  const { state, setState } = context;

  function updateMyContext(user: SessionUserFragment) {
    if (user) {
      setState((prevState: ContextState) => ({
        ...prevState,
        me: user,
      }));
    }
  }

  return { ...state, updateMyContext };
}

export { UserContextProvider, useUserContext };
