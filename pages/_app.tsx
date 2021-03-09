import { ConfigContextProvider } from 'context/configContext';
import { LocaleContextProvider } from 'context/localeContext';
import { ThemeContextProvider } from 'context/themeContext';
import { UserContextProvider } from 'context/userContext';
import { PageInitialDataPayload } from 'lib/catalogueUtils';
import * as React from 'react';
import './reset.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'apollo/apolloClient';
import { Provider } from 'next-auth/client';
import Router, { useRouter } from 'next/router';
import { AppContextProvider } from 'context/appContext';
import { NotificationsProvider } from 'context/notificationsContext';
import { GetSiteInitialDataPayloadInterface } from 'lib/ssrUtils';
import NProgress from 'nprogress';

export interface PagePropsInterface {
  initialData: PageInitialDataPayload;
}

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }: AppProps<GetSiteInitialDataPayloadInterface>) {
  const { locale, query } = useRouter();
  const { session, initialData } = pageProps;
  const apolloClient = useApollo(pageProps.initialApolloState, locale, query?.city as string);

  return (
    <Provider session={session}>
      <ApolloProvider client={apolloClient}>
        <AppContextProvider isMobileDevice={pageProps.isMobileDevice}>
          <NotificationsProvider>
            <ConfigContextProvider configs={initialData.configs} cities={initialData.cities}>
              <ThemeContextProvider>
                <LocaleContextProvider
                  languagesList={initialData.languages}
                  currency={initialData.currency}
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
