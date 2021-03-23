import { ConfigContextProvider } from 'context/configContext';
import { LocaleContextProvider } from 'context/localeContext';
import { ThemeContextProvider } from 'context/themeContext';
import { UserContextProvider } from 'context/userContext';
import { CompanyModel, UserModel } from 'db/dbModels';
import { PageInitialDataPayload } from 'lib/catalogueUtils';
import * as React from 'react';
import './reset.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'apollo/apolloClient';
import { Provider } from 'next-auth/client';
import Router from 'next/router';
import { AppContextProvider } from 'context/appContext';
import { NotificationsProvider } from 'context/notificationsContext';
import NProgress from 'nprogress';

export interface PagePropsInterface {
  initialData: PageInitialDataPayload;
  sessionCity: string;
  sessionLocale: string;
  initialApolloState?: any;
  domain?: any;
  company?: CompanyModel | null;
  sessionUser?: UserModel | null;
}

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }: AppProps<PagePropsInterface>) {
  const { session, initialData } = pageProps;
  const apolloClient = useApollo(
    pageProps.initialApolloState,
    pageProps.sessionLocale,
    pageProps.sessionCity,
  );

  return (
    <Provider session={session}>
      <ApolloProvider client={apolloClient}>
        <AppContextProvider
          sessionCity={pageProps.sessionCity}
          isMobileDevice={pageProps.isMobileDevice}
        >
          <NotificationsProvider>
            <ConfigContextProvider
              configs={initialData?.configs || []}
              cities={initialData?.cities || []}
            >
              <ThemeContextProvider>
                <LocaleContextProvider
                  languagesList={initialData?.languages || []}
                  currency={initialData?.currency || ''}
                >
                  <UserContextProvider>
                    <Component {...pageProps} />
                  </UserContextProvider>
                </LocaleContextProvider>
              </ThemeContextProvider>
            </ConfigContextProvider>
          </NotificationsProvider>
        </AppContextProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default App;
