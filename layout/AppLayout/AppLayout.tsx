import { useRouter } from 'next/router';
import * as React from 'react';
import Spinner from 'components/Spinner/Spinner';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { DEFAULT_CURRENCY } from 'config/common';
import { ConfigContextProvider } from 'context/configContext';
import { LocaleContextProvider } from 'context/localeContext';
import { ThemeContextProvider } from 'context/themeContext';
import { UserContextProvider, useUserContext } from 'context/userContext';
import { useInitialAppQuery } from 'generated/apolloComponents';
import { Theme } from 'types/clientTypes';
import AppNav from './AppNav';
import { useAppContext } from 'context/appContext';
import Meta from '../Meta';
import Modal from 'components/Modal/Modal';
import classes from './AppLayout.module.css';
import useCompact from 'hooks/useCompact';

interface AppLayoutConsumerInterface {
  title?: string;
}

const AppLayoutConsumer: React.FC<AppLayoutConsumerInterface> = ({ children, title }) => {
  const { pathname } = useRouter();
  const { isLoading, isModal, isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;
  const { me } = useUserContext();

  if (!me) {
    return <Spinner />;
  }

  const { appNavigation, cmsNavigation } = me.role;
  const navItems = pathname.includes('cms') ? cmsNavigation : appNavigation;

  return (
    <div className={classes.frame}>
      <Meta title={title} />

      <AppNav compact={compact} navItems={navItems} />

      <main className={`${classes.content} ${isCompact ? classes.contentCompact : ''}`}>
        <ErrorBoundary>
          <div>{children}</div>
        </ErrorBoundary>
      </main>

      {isLoading && <Spinner />}
      {isModal.show && <Modal modalType={isModal.variant} modalProps={isModal.props} />}
    </div>
  );
};

interface AppLayoutInterface extends AppLayoutConsumerInterface {
  description?: string;
  initialTheme: Theme;
}

const AppLayout: React.FC<AppLayoutInterface> = ({ children, initialTheme, title }) => {
  const { data } = useInitialAppQuery();

  return (
    <ConfigContextProvider
      configs={data?.getAllConfigs || []}
      cities={data?.getSessionCities || []}
    >
      <ThemeContextProvider initialTheme={initialTheme}>
        <LocaleContextProvider
          languagesList={data?.getAllLanguages || []}
          currency={data?.getSessionCurrency || DEFAULT_CURRENCY}
        >
          <UserContextProvider>
            <AppLayoutConsumer title={title}>{children}</AppLayoutConsumer>
          </UserContextProvider>
        </LocaleContextProvider>
      </ThemeContextProvider>
    </ConfigContextProvider>
  );
};

export default AppLayout;
