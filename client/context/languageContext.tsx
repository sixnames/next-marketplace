import React, { useCallback, useContext, useMemo } from 'react';
import { createContext } from 'react';
import { DEFAULT_LANG, IS_BROWSER, LANG_COOKIE_KEY, SECONDARY_LANG } from '../config';
import Cookies from 'js-cookie';

interface LanguageContextInterface {
  lang: string;
}

interface UseLanguageContextInterface {
  lang: string;
  setLanguage: (lang: string) => void;
  setRussianLanguage: () => void;
  setEnglishLanguage: () => void;
  languageIsRussian: boolean;
  languageIsEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextInterface>({
  lang: DEFAULT_LANG,
});

const LanguageContextProvider: React.FC<LanguageContextInterface> = ({ lang, children }) => {
  const value = useMemo(() => {
    return {
      lang: lang || DEFAULT_LANG,
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

function useLanguageContext(): UseLanguageContextInterface {
  const context = useContext<LanguageContextInterface>(LanguageContext);

  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageContextProvider');
  }

  const setLanguage = useCallback((lang: string) => {
    Cookies.set(LANG_COOKIE_KEY, lang);
    if (IS_BROWSER) {
      window.location.reload();
    }
  }, []);

  const setRussianLanguage = useCallback(() => {
    setLanguage(DEFAULT_LANG);
  }, [setLanguage]);

  const setEnglishLanguage = useCallback(() => {
    setLanguage(SECONDARY_LANG);
  }, [setLanguage]);

  const { lang } = context;

  return {
    lang,
    setLanguage,
    languageIsRussian: lang === DEFAULT_LANG,
    languageIsEnglish: lang === SECONDARY_LANG,
    setRussianLanguage,
    setEnglishLanguage,
  };
}

export { LanguageContextProvider, useLanguageContext };
