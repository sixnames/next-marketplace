import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import AnimateOpacity from '../../components/AnimateOpacity/AnimateOpacity';
import Footer from './Footer/Footer';
import Header from './Header/Header';
// import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import Meta from '../Meta';
import classes from './SiteLayout.module.css';
import { useAppContext } from '../../context/appContext';

interface SiteLayoutProps {
  title?: string;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ children, title }) => {
  const { isLoading } = useAppContext();

  return (
    <div className={classes.frame}>
      <Meta title={title} />

      <Header />

      <main className={classes.main}>
        <ErrorBoundary>
          <AnimateOpacity>{children}</AnimateOpacity>
        </ErrorBoundary>
      </main>

      <Footer />

      {isLoading && <Spinner wide />}
      {/*{isModal.show && <Modal modalType={isModal.type} modalProps={isModal.props} />}*/}
    </div>
  );
};

export default SiteLayout;
