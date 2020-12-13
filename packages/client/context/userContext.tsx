import React, { createContext, useContext, useMemo, useState } from 'react';
import { InitialQuery } from '../generated/apolloComponents';
import { useRouter } from 'next/router';

export type MeType = InitialQuery['me'];
export type ConfigsType = InitialQuery['getAllConfigs'];
export type CitiesType = InitialQuery['getAllCities'];

interface ContextState {
  isAuthenticated: boolean;
  me?: MeType;
}

interface UserContextInterface {
  state: ContextState;
  setState?: any;
}

const UserContext = createContext<UserContextInterface>({
  state: {
    isAuthenticated: false,
  },
});

interface UserContextProviderInterface {
  me: MeType;
}

const UserContextProvider: React.FC<UserContextProviderInterface> = ({ children, me }) => {
  const [state, setState] = useState<ContextState>(() => {
    return {
      me,
      isAuthenticated: Boolean(me),
    };
  });

  const value = useMemo(() => {
    return {
      state,
      setState,
    };
  }, [state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

function useUserContext() {
  const { replace } = useRouter();
  const context: UserContextInterface = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  const { state, setState } = context;

  function setMeIn(user: MeType) {
    if (user) {
      setState((prevState: ContextState) => ({
        ...prevState,
        isAuthenticated: true,
        me: user,
      }));
    }
  }

  function updateMyContext(user: MeType) {
    if (user) {
      setState((prevState: ContextState) => ({
        ...prevState,
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
    return replace('/');
  }

  return {
    ...state,
    setMeIn,
    setMeOut,
    updateMyContext,
  };
}

export { UserContextProvider, useUserContext };
