import * as React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import WpModal from '../components/Modal/WpModal';
import Spinner from '../components/Spinner';
import { useAppContext } from '../context/appContext';
import { useConfigContext } from '../context/configContext';
import { SiteContextProvider } from '../context/siteContext';
import { SiteUserContextProvider } from '../context/siteUserContext';
import { PagesGroupInterface, RubricInterface } from '../db/uiInterfaces';
import { PagePropsInterface } from '../pages/_app';
import Footer from './footer/Footer';
import Header from './header/Header';
import { StickNavInterface } from './header/StickyNav';
import Meta, { MetaInterface } from './Meta';

export interface SiteLayoutCatalogueCreatedPages {
  footerPageGroups: PagesGroupInterface[];
  headerPageGroups: PagesGroupInterface[];
}

interface SiteLayoutConsumerInterface
  extends SiteLayoutCatalogueCreatedPages,
    MetaInterface,
    StickNavInterface {
  noIndexFollow: boolean;
  seoSchema?: string;
}

const SiteLayoutConsumer: React.FC<SiteLayoutConsumerInterface> = ({
  children,
  title,
  description,
  footerPageGroups,
  headerPageGroups,
  previewImage,
  siteName,
  foundationYear,
  currentRubricSlug,
  showForIndex,
  noIndexFollow,
  seoSchema,
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
        previewImage={previewImage}
        siteName={siteName}
        foundationYear={foundationYear}
        showForIndex={showForIndex}
        noIndexFollow={noIndexFollow}
        seoSchema={seoSchema}
      />

      <Header headerPageGroups={headerPageGroups} currentRubricSlug={currentRubricSlug} />

      <div className='flex flex-col flex-grow'>
        <main className='flex-grow'>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        <Footer footerPageGroups={footerPageGroups} />
      </div>

      {isLoading ? <Spinner /> : null}
      {isModal.show ? <WpModal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

export interface SiteLayoutProviderInterface
  extends PagePropsInterface,
    StickNavInterface,
    SiteLayoutCatalogueCreatedPages {
  title?: string;
  description?: string;
  navRubrics: RubricInterface[];
  previewImage?: string;
  urlPrefix: string;
  showForIndex: boolean;
  noIndexFollow?: boolean;
  seoSchema?: string;
}

const SiteLayout: React.FC<SiteLayoutProviderInterface> = ({
  children,
  navRubrics,
  sessionCity,
  domainCompany,
  urlPrefix,
  noIndexFollow,
  ...props
}) => {
  return (
    <SiteUserContextProvider>
      <SiteContextProvider
        navRubrics={navRubrics}
        sessionCity={sessionCity}
        domainCompany={domainCompany}
        urlPrefix={urlPrefix}
      >
        <SiteLayoutConsumer {...props} noIndexFollow={Boolean(noIndexFollow)}>
          {children}
        </SiteLayoutConsumer>
      </SiteContextProvider>
    </SiteUserContextProvider>
  );
};

export default SiteLayout;
