import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import AnimateOpacity from '../../components/AnimateOpacity/AnimateOpacity';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Spinner from '../../components/Spinner/Spinner';
import Meta from '../Meta';
import { useAppContext } from '../../context/appContext';
import Modal from '../../components/Modal/Modal';
import classes from './SiteLayout.module.css';

interface SiteLayoutProps {
  title?: string;
  description?: string;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ children, title, description }) => {
  const { isLoading, isModal } = useAppContext();

  return (
    <div className={classes.frame}>
      <Meta title={title} description={description} />

      <Header />

      <main className={classes.main}>
        <ErrorBoundary>
          <AnimateOpacity>{children}</AnimateOpacity>
        </ErrorBoundary>
      </main>

      <Footer />

      {isLoading && <Spinner wide />}
      {isModal.show && <Modal modalType={isModal.type} modalProps={isModal.props} />}
    </div>
  );
};

export default SiteLayout;
