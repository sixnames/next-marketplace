import * as React from 'react';
import { SessionUserFragment, useSessionUserQuery } from 'generated/apolloComponents';

interface ContextState {
  isAuthenticated: boolean;
  me?: SessionUserFragment | null;
}

interface UserContextInterface {
  state: ContextState;
  setState?: any;
}

const UserContext = React.createContext<UserContextInterface>({
  state: {
    isAuthenticated: false,
  },
});

const UserContextProvider: React.FC = ({ children }) => {
  const { data } = useSessionUserQuery({ fetchPolicy: 'network-only' });
  const [state, setState] = React.useState<ContextState>(() => {
    return {
      me: null,
      isAuthenticated: false,
    };
  });

  React.useEffect(() => {
    if (data && data.me) {
      setState((prevState) => ({
        ...prevState,
        me: data.me,
        isAuthenticated: true,
      }));
    }
  }, [data]);

  const value = React.useMemo(() => {
    return {
      state,
      setState,
    };
  }, [state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

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
