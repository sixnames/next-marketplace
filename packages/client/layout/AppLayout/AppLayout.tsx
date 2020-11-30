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
import { AppPageInterface } from '../../utils/getAppServerSideProps';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import PrivateRoute from '../PrivateRoute';
import getFieldArrayFromTree from '../../utils/getFieldArrayFromTree';
import { AppNavContextProvider } from '../../context/appNavContext';
import { ROUTE_APP } from '@yagu/config';

interface AppLayoutInterface extends AppPageInterface {
  title?: string;
}

interface AppLayoutConsumerInterface {
  title?: string;
}

const AppLayoutConsumer: React.FC<AppLayoutConsumerInterface> = ({ children, title }) => {
  const { isLoading, isModal, isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;

  return (
    <div className={classes.frame}>
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

  const { appNavigation } = initialApolloState.getSessionRole;

  return (
    <PrivateRoute
      redirectPath={'/'}
      condition={(pathname) => {
        // Check nav permission
        const allowedPaths = getFieldArrayFromTree({
          tree: appNavigation,
          field: 'path',
        })
          .filter((path) => path)
          .map((path) => `${path}`.split('?')[0]);

        const allowedPathsCounter = allowedPaths.reduce((acc: number, path) => {
          const pathArr = path.split('/');
          const last = pathArr[pathArr.length - 1];

          if (path === ROUTE_APP) {
            return acc + 2;
          }

          if (pathname.indexOf(last) > -1) {
            return acc + 1;
          }
          return acc;
        }, 0);

        return allowedPathsCounter > 1;
      }}
    >
      <AppNavContextProvider navItems={appNavigation}>
        <AppLayoutConsumer title={title}>{children}</AppLayoutConsumer>
      </AppNavContextProvider>
    </PrivateRoute>
  );
};

export default AppLayout;
