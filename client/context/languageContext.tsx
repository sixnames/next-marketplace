import React, { useCallback, useContext, useMemo } from 'react';
import { createContext } from 'react';
import { DEFAULT_LANG, IS_BROWSER, LANG_COOKIE_KEY } from '../config';
import Cookies from 'js-cookie';
import { LangInput, Language, LanguageType } from '../generated/apolloComponents';

interface LanguageContextInterface {
  lang: string;
  languagesList: Language[];
}

interface UseLanguageContextInterface {
  lang: string;
  setLanguage: (lang: string) => void;
  isCurrentLanguage: (key: string) => boolean;
  languagesList: Language[];
  getLanguageFieldInitialValue: (field?: LanguageType[]) => LangInput[];
  getLanguageFieldInputValue: (field: LangInput[]) => LangInput[];
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

  const getLanguageFieldInitialValue = useCallback(
    (field?: LanguageType[]) => {
      if (!field || !field.length) {
        return languagesList.reduce((acc: LangInput[], language) => {
          return [...acc, { key: language.key, value: '' }];
        }, []);
      }

      return languagesList.reduce((acc: LangInput[], language) => {
        const fieldItem = field.find(({ key }) => language.key === key);
        if (fieldItem) {
          return [...acc, { key: language.key, value: fieldItem.value }];
        }
        return [...acc, { key: language.key, value: '' }];
      }, []);
    },
    [languagesList],
  );

  const getLanguageFieldInputValue = useCallback((field: LangInput[]) => {
    return field.filter(({ value }) => value);
  }, []);

  return {
    lang,
    setLanguage,
    languagesList,
    isCurrentLanguage,
    getLanguageFieldInitialValue,
    getLanguageFieldInputValue,
  };
}

export { LanguageContextProvider, useLanguageContext };
