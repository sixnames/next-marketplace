import React from 'react';
import { useApollo } from '../apollo/client';
import { NextPage } from 'next';
import './reset.css';
import { ThemeContextProvider } from '../context/themeContext';
import { AppContextProvider } from '../context/appContext';
import { NotificationsProvider } from '../context/notificationsContext';
import { ApolloProvider } from '@apollo/client';
import { ConfigContextProvider } from '../context/configContext';
import { LanguageContextProvider } from '../context/languageContext';
import { UserContextProvider } from '../context/userContext';
import RequestError from '../components/RequestError/RequestError';

interface AppInterface {
  Component: any;
  pageProps: any;
}

const App: NextPage<AppInterface> = ({ Component, pageProps }) => {
  const apolloClient = useApollo();
  // TODO cache store
  // const apolloClient = useApollo(pageProps.initialApolloState);

  if (!pageProps.initialApolloState) {
    return <RequestError />;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ConfigContextProvider
        configs={pageProps.initialApolloState.getAllConfigs}
        cities={pageProps.initialApolloState.getAllCities}
      >
        <ThemeContextProvider initialTheme={pageProps.initialTheme}>
          <LanguageContextProvider
            lang={pageProps.initialApolloState.getClientLanguage}
            languagesList={pageProps.initialApolloState.getAllLanguages}
            currency={pageProps.initialApolloState.getSessionCurrency}
          >
            <UserContextProvider me={pageProps.initialApolloState.me}>
              <AppContextProvider isMobileDevice={pageProps.isMobileDevice}>
                <NotificationsProvider>
                  <Component {...pageProps} />
                </NotificationsProvider>
              </AppContextProvider>
            </UserContextProvider>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </ConfigContextProvider>
    </ApolloProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export default App;
