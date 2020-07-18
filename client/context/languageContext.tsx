import React, { useCallback, useContext, useMemo } from 'react';
import { createContext } from 'react';
import { DEFAULT_LANG, IS_BROWSER, LANG_COOKIE_KEY } from '../config';
import Cookies from 'js-cookie';
import { Language } from '../generated/apolloComponents';

interface LanguageContextInterface {
  lang: string;
  languagesList: Language[];
}

interface UseLanguageContextInterface {
  lang: string;
  setLanguage: (lang: string) => void;
  isCurrentLanguage: (key: string) => boolean;
  languagesList: Language[];
}

const LanguageContext = createContext<LanguageContextInterface>({
  lang: DEFAULT_LANG,
  languagesList: [],
});

const LanguageContextProvider: React.FC<LanguageContextInterface> = ({
  lang,
  children,
  languagesList,
}) => {
  const value = useMemo(() => {
    return {
      lang: lang,
      languagesList,
    };
  }, [lang, languagesList]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

function useLanguageContext(): UseLanguageContextInterface {
  const context = useContext<LanguageContextInterface>(LanguageContext);

  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageContextProvider');
  }

  const { lang, languagesList } = context;

  const setLanguage = useCallback((lang: string) => {
    Cookies.set(LANG_COOKIE_KEY, lang);
    if (IS_BROWSER) {
      window.location.reload();
    }
  }, []);

  const isCurrentLanguage = useCallback(
    (key: string) => {
      return key === lang;
    },
    [lang],
  );

  return {
    lang,
    setLanguage,
    languagesList,
    isCurrentLanguage,
  };
}

export { LanguageContextProvider, useLanguageContext };
