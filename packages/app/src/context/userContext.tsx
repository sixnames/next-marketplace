import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useInitialQuery } from '../generated/apolloComponents';

export interface MeInterface {
  id: string;
  email: string;
  name: string;
  secondName?: string;
  lastName?: string;
  fullName: string;
  shortName: string;
  phone: string;
  role: string;
  isAdmin: boolean;
  isBookkeeper: boolean;
  isContractor: boolean;
  isDriver: boolean;
  isHelper: boolean;
  isLogistician: boolean;
  isManager: boolean;
  isStage: boolean;
  isWarehouse: boolean;
  isSuper: boolean;
}

interface ContextState {
  isAuthenticated: boolean;
  isFetching: boolean;
  me?: MeInterface;
}

type UserContext = {
  state: ContextState;
  setState?: any;
};

const UserContext = createContext<UserContext>({
  state: {
    isAuthenticated: false,
    isFetching: true,
  },
});

const UserContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    isFetching: true,
  });

  const { loading, error, data } = useInitialQuery({
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (!loading && !error) {
      setState((prevState) => ({
        ...prevState,
        me: data ? data.me : null,
        isAuthenticated: Boolean(data && data.me),
        isFetching: false,
      }));
    }
  }, [loading, error, data]);

  const value = useMemo(() => {
    return {
      state,
      setState,
    };
  }, [state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

function useUserContext() {
  const context: UserContext = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  const { state, setState } = context;

  function setMeIn(user: MeInterface | null) {
    if (user) {
      setState((prevState: ContextState) => ({
        ...prevState,
        isAuthenticated: true,
        me: user,
      }));
    }
  }

  function setMeOut() {
    setState((prevState: ContextState) => {
      return {
        ...prevState,
        isAuthenticated: false,
        me: null,
      };
    });
  }

  return {
    ...state,
    setMeIn,
    setMeOut,
  };
}

export { UserContextProvider, useUserContext };
