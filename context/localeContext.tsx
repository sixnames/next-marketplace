import * as React from 'react';
import { createContext } from 'react';
import { InitialQueryLanguageFragment } from 'generated/apolloComponents';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from 'config/common';
import { useRouter } from 'next/router';

interface LocaleContextInterface {
  languagesList: InitialQueryLanguageFragment[];
  currency: string;
}

const LocaleContext = createContext<LocaleContextInterface>({
  languagesList: [],
  currency: DEFAULT_CURRENCY,
});

const LocaleContextProvider: React.FC<LocaleContextInterface> = ({
  children,
  languagesList,
  currency,
}) => {
  const value = React.useMemo(() => {
    return {
      languagesList,
      currency,
    };
  }, [currency, languagesList]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

interface UseLocaleContextInterface {
  locale: string;
  dbLocales: string[];
  currency: string;
  defaultLocale: string;
  currentLocaleItem?: InitialQueryLanguageFragment;
  defaultLocaleItem?: InitialQueryLanguageFragment;
  languagesList: InitialQueryLanguageFragment[];
}

function useLocaleContext(): UseLocaleContextInterface {
  const { locale = DEFAULT_LOCALE, defaultLocale = DEFAULT_LOCALE } = useRouter();
  const context = React.useContext<LocaleContextInterface>(LocaleContext);

  if (!context) {
    throw new Error('useLocaleContext must be used within a LocaleContextProvider');
  }

  const { languagesList, currency } = context;
  const currentLocaleItem = languagesList.find(({ slug }) => slug === locale);
  const defaultLocaleItem = languagesList.find(({ slug }) => slug === defaultLocale);
  const dbLocales = [...languagesList]
    .sort(({ slug }) => (slug === defaultLocale ? 1 : 0))
    .map(({ slug }) => slug);

  return {
    locale,
    dbLocales,
    currency,
    currentLocaleItem,
    defaultLocale,
    defaultLocaleItem,
    languagesList,
  };
}

export { LocaleContextProvider, useLocaleContext };
