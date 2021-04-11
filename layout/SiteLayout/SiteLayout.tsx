import { RubricModel } from 'db/dbModels';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Spinner from '../../components/Spinner/Spinner';
import Meta, { PageUrlsInterface } from '../Meta';
import { useAppContext } from 'context/appContext';
import { SiteContextProvider } from 'context/siteContext';
import classes from './SiteLayout.module.css';
import Modal from 'components/Modal/Modal';

interface SiteLayoutConsumerInterface {
  title?: string;
  description?: string;
  previewImage?: string;
  pageUrls: PageUrlsInterface;
}

const SiteLayoutConsumer: React.FC<SiteLayoutConsumerInterface> = ({
  children,
  title,
  description,
  pageUrls,
}) => {
  const { isLoading, isModal } = useAppContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={classes.frame}>
      <Meta title={title} description={description} pageUrls={pageUrls} />

      <Header />

      <div ref={contentRef} className={classes.content}>
        <main className={classes.main}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        <Footer />
      </div>

      {isLoading ? <Spinner wide /> : null}
      {isModal.show ? <Modal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

export interface SiteLayoutInterface extends PagePropsInterface {
  title?: string;
  description?: string;
  navRubrics: RubricModel[];
  previewImage?: string;
}

const SiteLayout: React.FC<SiteLayoutInterface> = ({
  children,
  navRubrics,
  title,
  description,
  pageUrls,
  sessionCity,
  company,
}) => {
  return (
    <SiteContextProvider navRubrics={navRubrics} sessionCity={sessionCity} company={company}>
      <SiteLayoutConsumer title={title} description={description} pageUrls={pageUrls}>
        {children}
      </SiteLayoutConsumer>
    </SiteContextProvider>
  );
};

export default SiteLayout;
