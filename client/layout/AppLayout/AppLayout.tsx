import React, { useEffect } from 'react';
import { useUserContext } from '../../context/userContext';
import { ROUTE_SIGN_IN } from '../../../config';
import Spinner from '../../components/Spinner/Spinner';
import Modal from '../../components/Modal/Modal';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import AnimateOpacity from '../../components/AnimateOpacity/AnimateOpacity';
import Meta from '../Meta';
import Router from 'next/router';
import AppNav from './AppNav';
import PrivateRoute from '../PrivateRoute';
import { useAppContext } from '../../context/appContext';
import classes from './AppLayout.module.css';

interface AppLayoutInterface {
  title?: string;
}

const AppLayout: React.FC<AppLayoutInterface> = ({ children, title }) => {
  const { isFetching, isAuthenticated } = useUserContext();
  const { isModal, isLoading } = useAppContext();

  useEffect(() => {
    if (!isAuthenticated && !isFetching) {
      Router.replace(ROUTE_SIGN_IN);
    }
  }, [isAuthenticated, isFetching]);

  if (isFetching || !isAuthenticated) {
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className={classes.frame}>
        <Meta title={title} />

        <AppNav />

        <main className={classes.content}>
          <ErrorBoundary>
            <AnimateOpacity>{children}</AnimateOpacity>
          </ErrorBoundary>
        </main>

        {isLoading && <Spinner />}
        {isModal.show && <Modal modalType={isModal.type} modalProps={isModal.props} />}
      </div>
    </PrivateRoute>
  );
};

export default AppLayout;
