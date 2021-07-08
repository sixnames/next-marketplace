import { useConfigContext } from 'context/configContext';
import {
  SiteLayoutCatalogueCreatedPages,
  SiteLayoutProviderInterface,
} from 'layout/SiteLayoutProvider';
import * as React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import Footer from 'layout/SiteLayout/Footer';
import Header from 'layout/SiteLayout/Header';
import Spinner from 'components/Spinner';
import Meta, { PageUrlsInterface } from '../Meta';
import { useAppContext } from 'context/appContext';
import { SiteContextProvider } from 'context/siteContext';
import Modal from 'components/Modal/Modal';

interface SiteLayoutConsumerInterface extends SiteLayoutCatalogueCreatedPages {
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
  footerPageGroups,
  headerPageGroups,
}) => {
  const { isLoading, isModal } = useAppContext();
  const { getSiteConfigSingleValue } = useConfigContext();

  // Metrics
  const yaMetrica = getSiteConfigSingleValue('yaMetrica') || '';
  const googleAnalytics = getSiteConfigSingleValue('googleAnalytics') || '';
  const metricsCodeAsString = `${yaMetrica}${googleAnalytics}`;

  return (
    <div className='relative flex flex-col text-primary-text bg-primary min-h-full-height'>
      <div dangerouslySetInnerHTML={{ __html: metricsCodeAsString }} />

      <Meta title={title} description={description} pageUrls={pageUrls} />

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
}) => {
  return (
    <SiteContextProvider navRubrics={navRubrics} sessionCity={sessionCity} company={company}>
      <SiteLayoutConsumer
        title={title}
        description={description}
        pageUrls={pageUrls}
        footerPageGroups={footerPageGroups}
        headerPageGroups={headerPageGroups}
      >
        {children}
      </SiteLayoutConsumer>
    </SiteContextProvider>
  );
};

export default SiteLayout;
