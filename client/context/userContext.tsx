import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { InitialQuery, Language } from '../generated/apolloComponents';
import { useRouter } from 'next/router';
import { LanguageContextProvider } from './languageContext';
import { ConfigContextProvider } from './configContext';

export type MeType = InitialQuery['me'];
export type ConfigsType = InitialQuery['getAllConfigs'];

interface ContextState {
  isAuthenticated: boolean;
  me?: MeType;
}

type UserContext = {
  state: ContextState;
  setState?: any;
};

const UserContext = createContext<UserContext>({
  state: {
    isAuthenticated: false,
  },
});

interface UserContextProviderInterface {
  me: MeType;
  lang: string;
  languagesList: Language[];
  configs: ConfigsType;
}

const UserContextProvider: React.FC<UserContextProviderInterface> = ({
  children,
  me,
  lang,
  languagesList,
  configs,
}) => {
  const [state, setState] = useState<ContextState>({
    isAuthenticated: false,
  });

  useEffect(() => {
    if (me) {
      setState({
        me,
        isAuthenticated: Boolean(me),
      });
    }
  }, [me]);

  const value = useMemo(() => {
    return {
      state,
      setState,
    };
  }, [state]);

  return (
    <LanguageContextProvider lang={lang} languagesList={languagesList}>
      <ConfigContextProvider configs={configs}>
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
      </ConfigContextProvider>
    </LanguageContextProvider>
  );
};

function useUserContext() {
  const { replace } = useRouter();
  const context: UserContext = useContext(UserContext);

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
  };
}

export { UserContextProvider, useUserContext };
