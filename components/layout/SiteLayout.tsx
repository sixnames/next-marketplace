import { useAppContext } from 'components/context/appContext';
import { useConfigContext } from 'components/context/configContext';
import { SiteContextProvider } from 'components/context/siteContext';
import { SiteUserContextProvider } from 'components/context/siteUserContext';
import ErrorBoundary from 'components/ErrorBoundary';
import Footer from 'components/layout/footer/Footer';
import Header from 'components/layout/header/Header';
import { StickNavInterface } from 'components/layout/header/StickyNav';
import Meta, { MetaInterface } from 'components/layout/Meta';
import WpModal from 'components/Modal/WpModal';
import Spinner from 'components/Spinner';
import { EventRubricInterface, PagesGroupInterface, RubricInterface } from 'db/uiInterfaces';
import { useSetSessionNavLog } from 'hooks/mutations/useSessionLogMutations';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

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
    <div className='relative flex min-h-full-height flex-col bg-primary text-primary-text'>
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

      <div className='flex flex-grow flex-col'>
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
  navEventRubrics: EventRubricInterface[];
  previewImage?: string;
  showForIndex: boolean;
  noIndexFollow?: boolean;
  seoSchema?: string;
}

const SiteLayout: React.FC<SiteLayoutProviderInterface> = ({
  children,
  citySlug,
  domainCompany,
  noIndexFollow,
  navRubrics,
  navEventRubrics,
  ...props
}) => {
  useSetSessionNavLog();

  return (
    <SiteUserContextProvider>
      <SiteContextProvider
        navEventRubrics={navEventRubrics}
        navRubrics={navRubrics}
        sessionCity={citySlug}
        domainCompany={domainCompany}
      >
        <SiteLayoutConsumer {...props} noIndexFollow={Boolean(noIndexFollow)}>
          {children}
        </SiteLayoutConsumer>
      </SiteContextProvider>
    </SiteUserContextProvider>
  );
};

export default SiteLayout;
