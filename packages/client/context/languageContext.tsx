import React, { useCallback, useContext, useMemo } from 'react';
import { createContext } from 'react';
import { IS_BROWSER } from '../config';
import { DEFAULT_LANG, LANG_COOKIE_KEY, LANG_NOT_FOUND_FIELD_MESSAGE } from '@yagu/config';
import Cookies from 'js-cookie';
import {
  AttributePositioningInTitle,
  AttributePositioningInTitleInput,
  AttributePositionInTitleEnum,
  LangInput,
  Language,
  LanguageType,
} from '../generated/apolloComponents';

interface LanguageContextInterface {
  lang: string;
  languagesList: Language[];
}

interface UseLanguageContextInterface {
  lang: string;
  defaultLang: string;
  setLanguage: (lang: string) => void;
  isCurrentLanguage: (key: string) => boolean;
  languagesList: Language[];
  getLanguageFieldTranslation: (field?: LanguageType[] | null) => string;
  getLanguageFieldInitialValue: (field?: LanguageType[] | null) => LangInput[];
  getLanguageFieldInputValue: (field: LangInput[] | null) => LangInput[];
  getAttributePositionInTitleInitialValue: (
    field?: AttributePositioningInTitle[] | null,
  ) => AttributePositioningInTitleInput[];
  getAttributePositionInTitleInputValue: (
    field: AttributePositioningInTitleInput[] | null,
  ) => AttributePositioningInTitleInput[];
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

  const defaultLangItem = languagesList.find(({ isDefault }) => isDefault);
  const defaultLang = defaultLangItem ? defaultLangItem.key : DEFAULT_LANG;

  const getLanguageFieldTranslation = useCallback(
    (field?: LanguageType[] | null) => {
      if (!field) {
        return LANG_NOT_FOUND_FIELD_MESSAGE;
      }

      const translation = field.find(({ key }) => key === lang);
      return translation ? translation.value : LANG_NOT_FOUND_FIELD_MESSAGE;
    },
    [lang],
  );

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
    (field?: LanguageType[] | null) => {
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

  const getLanguageFieldInputValue = useCallback((field: LangInput[] | null) => {
    if (!field) {
      return [];
    }

    return field.filter(({ value }) => value);
  }, []);

  const getAttributePositionInTitleInitialValue = useCallback(
    (field?: AttributePositioningInTitle[] | null) => {
      if (!field || !field.length) {
        return languagesList.reduce((acc: AttributePositioningInTitle[], language) => {
          return [...acc, { key: language.key, value: '' as AttributePositionInTitleEnum }];
        }, []);
      }

      return languagesList.reduce((acc: AttributePositioningInTitle[], language) => {
        const fieldItem = field.find(({ key }) => language.key === key);
        if (fieldItem) {
          return [
            ...acc,
            { key: language.key, value: fieldItem.value as AttributePositionInTitleEnum },
          ];
        }
        return [...acc, { key: language.key, value: '' as AttributePositionInTitleEnum }];
      }, []);
    },
    [languagesList],
  );

  const getAttributePositionInTitleInputValue = useCallback(
    (field: AttributePositioningInTitleInput[] | null) => {
      if (!field) {
        return [];
      }

      return field.filter(({ value }) => value);
    },
    [],
  );

  return {
    lang,
    defaultLang,
    setLanguage,
    languagesList,
    isCurrentLanguage,
    getLanguageFieldInitialValue,
    getLanguageFieldInputValue,
    getAttributePositionInTitleInitialValue,
    getAttributePositionInTitleInputValue,
    getLanguageFieldTranslation,
  };
}

export { LanguageContextProvider, useLanguageContext };
