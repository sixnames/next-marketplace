import ErrorBoundary from 'components/ErrorBoundary';
import Modal from 'components/Modal/Modal';
import Spinner from 'components/Spinner';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { SiteContextProvider } from 'context/siteContext';
import { CompanyModel } from 'db/dbModels';
import Meta, { MetaInterface } from 'layout/Meta';
import Footer from 'layout/footer/Footer';
import Header from 'layout/header/Header';
import {
  SiteLayoutCatalogueCreatedPages,
  SiteLayoutProviderInterface,
} from 'layout/SiteLayoutProvider';
import * as React from 'react';

interface CompanyDefaultLayoutConsumerInterface
  extends SiteLayoutCatalogueCreatedPages,
    MetaInterface {
  company?: CompanyModel | null;
}

const CompanyDefaultLayoutConsumer: React.FC<CompanyDefaultLayoutConsumerInterface> = ({
  children,
  title,
  description,
  pageUrls,
  company,
  headerPageGroups,
  footerPageGroups,
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
      <Header headerPageGroups={headerPageGroups} company={company} />

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

const CompanyDefaultLayout: React.FC<SiteLayoutProviderInterface> = ({
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
      <CompanyDefaultLayoutConsumer
        title={title}
        description={description}
        pageUrls={pageUrls}
        company={company}
        footerPageGroups={footerPageGroups}
        headerPageGroups={headerPageGroups}
      >
        {children}
      </CompanyDefaultLayoutConsumer>
    </SiteContextProvider>
  );
};

export default CompanyDefaultLayout;
