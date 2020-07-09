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

interface AppLayoutInterface {
  title?: string;
}

const AppLayout: React.FC<AppLayoutInterface> = ({ children, title }) => {
  const { isLoading, isModal } = useAppContext();
  const isMobile = useIsMobile();
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

export default AppLayout;
