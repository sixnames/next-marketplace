import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { InitialQuery, Language } from '../generated/apolloComponents';
import { useRouter } from 'next/router';
import { LanguageContextProvider } from './languageContext';
import { ConfigContextProvider } from './configContext';
import { DEFAULT_CURRENCY } from '@yagu/config';

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
  currency: string;
}

const UserContext = createContext<UserContextInterface>({
  currency: DEFAULT_CURRENCY,
  state: {
    isAuthenticated: false,
  },
});

interface UserContextProviderInterface {
  me: MeType;
  lang: string;
  languagesList: Language[];
  configs: ConfigsType;
  cities: CitiesType;
  currency: string;
}

const UserContextProvider: React.FC<UserContextProviderInterface> = ({
  children,
  me,
  lang,
  languagesList,
  configs,
  cities,
  currency,
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
      currency,
    };
  }, [currency, state]);

  return (
    <LanguageContextProvider lang={lang} languagesList={languagesList}>
      <ConfigContextProvider configs={configs} cities={cities}>
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
      </ConfigContextProvider>
    </LanguageContextProvider>
  );
};

function useUserContext() {
  const { replace } = useRouter();
  const context: UserContextInterface = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  const { state, setState, currency } = context;

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
    currency,
    setMeIn,
    setMeOut,
    updateMyContext,
  };
}

export { UserContextProvider, useUserContext };
