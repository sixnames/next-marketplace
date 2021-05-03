import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import Modal from 'components/Modal/Modal';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { SiteContextProvider } from 'context/siteContext';
import { CompanyModel } from 'db/dbModels';
import CompanyDefaultLayoutFooter from 'layout/CompanyDefaultLayout/CompanyDefaultLayoutFooter';
import CompanyDefaultLayoutHeader from 'layout/CompanyDefaultLayout/CompanyDefaultLayoutHeader';
import Meta, { PageUrlsInterface } from 'layout/Meta';
import { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import * as React from 'react';

interface CompanyDefaultLayoutConsumerInterface {
  title?: string;
  description?: string;
  previewImage?: string;
  pageUrls: PageUrlsInterface;
  company?: CompanyModel | null;
}

const CompanyDefaultLayoutConsumer: React.FC<CompanyDefaultLayoutConsumerInterface> = ({
  children,
  title,
  description,
  pageUrls,
  company,
}) => {
  const { isLoading, isModal } = useAppContext();
  const { getSiteConfigSingleValue } = useConfigContext();

  // Metrics
  const yaMetrica = getSiteConfigSingleValue('yaMetrica') || '';
  const googleAnalytics = getSiteConfigSingleValue('googleAnalytics') || '';
  const metricsCodeAsString = `${yaMetrica}${googleAnalytics}`;

  return (
    <div className='flex flex-col text-primary-text bg-primary min-h-full-height'>
      <div dangerouslySetInnerHTML={{ __html: metricsCodeAsString }} />
      <Meta title={title} description={description} pageUrls={pageUrls} />
      <CompanyDefaultLayoutHeader company={company} />

      <div className='flex flex-col flex-grow'>
        <main className='flex-grow'>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        <CompanyDefaultLayoutFooter />
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
}) => {
  return (
    <SiteContextProvider navRubrics={navRubrics} sessionCity={sessionCity} company={company}>
      <CompanyDefaultLayoutConsumer
        title={title}
        description={description}
        pageUrls={pageUrls}
        company={company}
      >
        {children}
      </CompanyDefaultLayoutConsumer>
    </SiteContextProvider>
  );
};

export default CompanyDefaultLayout;
