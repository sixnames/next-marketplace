import { ConfigContextProvider } from 'context/configContext';
import { LocaleContextProvider } from 'context/localeContext';
import { ThemeContextProvider } from 'context/themeContext';
import { UserContextProvider } from 'context/userContext';
import { CompanyModel } from 'db/dbModels';
import { CityInterface, CompanyInterface, UserInterface } from 'db/uiInterfaces';
import { PageUrlsInterface } from 'layout/Meta';
import { PageInitialDataPayload } from 'lib/ssrUtils';
import * as React from 'react';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'apollo/apolloClient';
import { Provider } from 'next-auth/client';
import Router from 'next/router';
import { AppContextProvider } from 'context/appContext';
import { NotificationsProvider } from 'context/notificationsContext';
import NProgress from 'nprogress';
import { Theme } from 'types/clientTypes';

export interface PagePropsInterface {
  initialData: PageInitialDataPayload;
  sessionCity: string;
  sessionLocale: string;
  initialApolloState?: any;
  company?: CompanyModel | null;
  sessionUser?: UserInterface | null;
  currentCity?: CityInterface | null;
  pageUrls: PageUrlsInterface;
  currentCompany?: CompanyInterface | null;
  companySlug: string;
  themeStyle: Record<string, any>;
  initialTheme: Theme;
}

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }: AppProps<PagePropsInterface>) {
  const { session, initialData, currentCity, themeStyle, initialTheme } = pageProps;
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <Provider session={session}>
      <div
        className={`min-h-[100vh] ${initialTheme}`}
        id={'theme-provider'}
        data-theme={initialTheme}
        style={themeStyle}
      >
        <ApolloProvider client={apolloClient}>
          <AppContextProvider
            companySlug={pageProps.companySlug}
            sessionCity={pageProps.sessionCity}
            isMobileDevice={pageProps.isMobileDevice}
            configs={initialData?.configs || []}
          >
            <NotificationsProvider>
              <ConfigContextProvider
                currentCity={currentCity}
                configs={initialData?.configs || []}
                cities={initialData?.cities || []}
              >
                <ThemeContextProvider initialTheme={initialTheme}>
                  <LocaleContextProvider
                    languagesList={initialData?.languages || []}
                    currency={initialData?.currency || ''}
                  >
                    <UserContextProvider sessionUser={pageProps.sessionUser}>
                      <Component {...pageProps} />
                    </UserContextProvider>
                  </LocaleContextProvider>
                </ThemeContextProvider>
              </ConfigContextProvider>
            </NotificationsProvider>
          </AppContextProvider>
        </ApolloProvider>
      </div>
    </Provider>
  );
}

export default App;
