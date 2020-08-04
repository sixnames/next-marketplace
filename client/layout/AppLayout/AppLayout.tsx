import React from 'react';
import Spinner from '../../components/Spinner/Spinner';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import AnimateOpacity from '../../components/AnimateOpacity/AnimateOpacity';
import AppNav from './AppNav';
import { useAppContext } from '../../context/appContext';
import Meta from '../Meta';
import Modal from '../../components/Modal/Modal';
import classes from './AppLayout.module.css';
import useCompact from '../../hooks/useCompact';
import useIsMobile from '../../hooks/useIsMobile';
import { UserContextProvider } from '../../context/userContext';
import { AppPageInterface } from '../../utils/getAppServerSideProps';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import { useConfigContext } from '../../context/configContext';

interface AppLayoutInterface extends AppPageInterface {
  title?: string;
}

interface AppLayoutConsumerInterface {
  title?: string;
}

const AppLayoutConsumer: React.FC<AppLayoutConsumerInterface> = ({ children, title }) => {
  const { isLoading, isModal } = useAppContext();
  const isMobile = useIsMobile();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;
  const { getSiteConfigSingleValue } = useConfigContext();
  const themeColor = getSiteConfigSingleValue('siteThemeColor');
  const themeStyles = { '--theme': themeColor } as React.CSSProperties;

  return (
    <div className={classes.frame} style={themeStyles}>
      <Meta title={title} />

      <AppNav compact={compact} />

      <main className={`${classes.content} ${isCompact ? classes.contentCompact : ''}`}>
        <ErrorBoundary>
          <AnimateOpacity>{children}</AnimateOpacity>
        </ErrorBoundary>
      </main>

      {isLoading && <Spinner />}
      {isModal.show && <Modal modalType={isModal.type} modalProps={isModal.props} />}
    </div>
  );
};

const AppLayout: React.FC<AppLayoutInterface> = ({ children, title, initialApolloState }) => {
  if (!initialApolloState) {
    return (
      <div className={classes.frame}>
        <Inner>
          <RequestError />
        </Inner>
      </div>
    );
  }

  return (
    <UserContextProvider
      me={initialApolloState.me}
      lang={initialApolloState.getClientLanguage}
      languagesList={initialApolloState.getAllLanguages || []}
      configs={initialApolloState.getAllConfigs}
    >
      <AppLayoutConsumer title={title}>{children}</AppLayoutConsumer>
    </UserContextProvider>
  );
};

export default AppLayout;
