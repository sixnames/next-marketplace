import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'apollo/apolloClient';
import { AppContextProvider } from 'components/context/appContext';
import { ConfigContextProvider } from 'components/context/configContext';
import { LocaleContextProvider } from 'components/context/localeContext';
import { NotificationsProvider } from 'components/context/notificationsContext';
import { ThemeContextProvider } from 'components/context/themeContext';
import { CityInterface, CompanyInterface } from 'db/uiInterfaces';
import { PageInitialDataPayload } from 'lib/getPageDataSsr';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import * as React from 'react';
import { SWRConfig } from 'swr';
import '../styles/globals.css';

export interface PagePropsInterface {
  initialData: PageInitialDataPayload;
  citySlug: string;
  sessionLocale: string;
  initialApolloState?: any;
  currentCity?: CityInterface | null;
  themeStyle: Record<string, any>;
  companySlug: string;
  domainCompany?: CompanyInterface | null;
}

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }: AppProps<PagePropsInterface>) {
  const { session, initialData, currentCity, themeStyle } = pageProps;
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: (resource, init) => {
            return fetch(resource, init).then((res) => res.json());
          },
        }}
      >
        <div className={`min-h-[100vh]`} id={'theme-provider'} style={themeStyle}>
          <ApolloProvider client={apolloClient}>
            <ConfigContextProvider
              domainCompany={pageProps.domainCompany}
              currentCity={currentCity}
              configs={initialData?.configs || []}
              cities={initialData?.cities || []}
            >
              <AppContextProvider
                companySlug={pageProps.companySlug}
                sessionCity={pageProps.sessionCity}
                isMobileDevice={pageProps.isMobileDevice}
              >
                <NotificationsProvider>
                  <ThemeContextProvider>
                    <LocaleContextProvider
                      languagesList={initialData?.languages || []}
                      currency={initialData?.currency || ''}
                    >
                      <Component {...pageProps} />
                    </LocaleContextProvider>
                  </ThemeContextProvider>
                </NotificationsProvider>
              </AppContextProvider>
            </ConfigContextProvider>
          </ApolloProvider>
        </div>
      </SWRConfig>
    </SessionProvider>
  );
}

export default App;
