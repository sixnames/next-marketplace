import ErrorBoundary from 'components/ErrorBoundary';
import Modal from 'components/Modal/Modal';
import Spinner from 'components/Spinner';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { SiteContextProvider } from 'context/siteContext';
import { PagesGroupInterface, RubricInterface } from 'db/uiInterfaces';
import Footer from 'layout/footer/Footer';
import Header from 'layout/header/Header';
import Meta, { MetaInterface } from 'layout/Meta';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

export interface SiteLayoutCatalogueCreatedPages {
  footerPageGroups: PagesGroupInterface[];
  headerPageGroups: PagesGroupInterface[];
}

export interface SiteLayoutProviderInterface
  extends PagePropsInterface,
    SiteLayoutCatalogueCreatedPages {
  title?: string;
  description?: string;
  navRubrics: RubricInterface[];
  previewImage?: string;
}

interface SiteLayoutConsumerInterface extends SiteLayoutCatalogueCreatedPages, MetaInterface {}

const SiteLayoutConsumer: React.FC<SiteLayoutConsumerInterface> = ({
  children,
  title,
  description,
  pageUrls,
  footerPageGroups,
  headerPageGroups,
  previewImage,
  siteName,
  foundationYear,
}) => {
  const { isLoading, isModal } = useAppContext();
  const { configs } = useConfigContext();

  // Metrics
  const yaMetrica = configs.yaMetrica;
  const googleAnalytics = configs.googleAnalytics;
  const metricsCodeAsString = `${yaMetrica}${googleAnalytics}`;

  return (
    <div className='relative flex flex-col text-primary-text bg-primary min-h-full-height'>
      <div dangerouslySetInnerHTML={{ __html: metricsCodeAsString }} />

      <Meta
        title={title}
        description={description}
        pageUrls={pageUrls}
        previewImage={previewImage}
        siteName={siteName}
        foundationYear={foundationYear}
      />

      <Header headerPageGroups={headerPageGroups} />

      <div className='flex flex-col flex-grow'>
        <main className='flex-grow'>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        <Footer footerPageGroups={footerPageGroups} />
      </div>

      {isLoading ? <Spinner /> : null}
      {isModal.show ? <Modal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

const SiteLayout: React.FC<SiteLayoutProviderInterface> = ({
  children,
  navRubrics,
  title,
  description,
  pageUrls,
  sessionCity,
  company,
  footerPageGroups,
  headerPageGroups,
  ...props
}) => {
  return (
    <SiteContextProvider navRubrics={navRubrics} sessionCity={sessionCity} company={company}>
      <SiteLayoutConsumer
        title={title}
        description={description}
        pageUrls={pageUrls}
        footerPageGroups={footerPageGroups}
        headerPageGroups={headerPageGroups}
        {...props}
      >
        {children}
      </SiteLayoutConsumer>
    </SiteContextProvider>
  );
};

export default SiteLayout;
