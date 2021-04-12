import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import Modal from 'components/Modal/Modal';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'context/appContext';
import { SiteContextProvider } from 'context/siteContext';
import { RubricModel } from 'db/dbModels';
import Meta, { PageUrlsInterface } from 'layout/Meta';
import Footer from 'layout/SiteLayout/Footer/Footer';
import Header from 'layout/SiteLayout/Header/Header';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface CompanyDefaultLayoutConsumerInterface {
  title?: string;
  description?: string;
  previewImage?: string;
  pageUrls: PageUrlsInterface;
}

const CompanyDefaultLayoutConsumer: React.FC<CompanyDefaultLayoutConsumerInterface> = ({
  children,
  title,
  description,
  pageUrls,
}) => {
  const { isLoading, isModal } = useAppContext();

  return (
    <div className='flex flex-col text-primary-text bg-primary-background min-h-full-height'>
      <Meta title={title} description={description} pageUrls={pageUrls} />

      <Header />

      <div className='flex flex-col flex-grow'>
        <main className='flex-grow'>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        <Footer />
      </div>

      {isLoading ? <Spinner wide /> : null}
      {isModal.show ? <Modal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

export interface CompanyDefaultLayoutInterface extends PagePropsInterface {
  title?: string;
  description?: string;
  navRubrics: RubricModel[];
  previewImage?: string;
}

const CompanyDefaultLayout: React.FC<CompanyDefaultLayoutInterface> = ({
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
      <CompanyDefaultLayoutConsumer title={title} description={description} pageUrls={pageUrls}>
        {children}
      </CompanyDefaultLayoutConsumer>
    </SiteContextProvider>
  );
};

export default CompanyDefaultLayout;
