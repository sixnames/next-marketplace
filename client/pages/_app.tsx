import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { useApollo } from '../apollo/client';
import { NextPage } from 'next';
import './reset.css';
import { ThemeContextProvider } from '../context/themeContext';
import { AppContextProvider } from '../context/appContext';
import { NotificationsProvider } from '../context/notificationsContext';

interface AppInterface {
  Component: any;
  pageProps: any;
}

const App: NextPage<AppInterface> = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ThemeContextProvider>
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
