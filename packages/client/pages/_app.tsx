import React from 'react';
import { useApollo } from '../apollo/client';
import { NextPage } from 'next';
import './reset.css';
import { ThemeContextProvider } from '../context/themeContext';
import { AppContextProvider } from '../context/appContext';
import { NotificationsProvider } from '../context/notificationsContext';
import { ApolloProvider } from '@apollo/client';

interface AppInterface {
  Component: any;
  pageProps: any;
}

const App: NextPage<AppInterface> = ({ Component, pageProps }) => {
  const apolloClient = useApollo();
  // TODO cache store
  // const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ThemeContextProvider initialTheme={pageProps.initialTheme}>
      <ApolloProvider client={apolloClient}>
        <AppContextProvider>
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </AppContextProvider>
      </ApolloProvider>
    </ThemeContextProvider>
  );
};

// noinspection JSUnusedGlobalSymbols
export default App;
