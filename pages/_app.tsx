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
  isMobileDevice: boolean;
}

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }: AppProps<GetSiteInitialDataPayloadInterface>) {
  const { locale, query } = useRouter();
  const { session } = pageProps;
  const apolloClient = useApollo(pageProps.initialApolloState, locale, query?.city as string);

  return (
    <Provider session={session}>
      <ApolloProvider client={apolloClient}>
        <AppContextProvider isMobileDevice={pageProps.isMobileDevice}>
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </AppContextProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default App;
