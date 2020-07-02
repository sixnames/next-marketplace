import React from 'react';
import Spinner from '../../components/Spinner/Spinner';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import AnimateOpacity from '../../components/AnimateOpacity/AnimateOpacity';
import AppNav from './AppNav';
import { useAppContext } from '../../context/appContext';
import Meta from '../Meta';
import Modal from '../../components/Modal/Modal';
import classes from './AppLayout.module.css';

interface AppLayoutInterface {
  title?: string;
}

const AppLayout: React.FC<AppLayoutInterface> = ({ children, title }) => {
  const { isLoading, isModal } = useAppContext();

  return (
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
  );
};

export default AppLayout;
