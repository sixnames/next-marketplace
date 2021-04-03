import { CompanyContextProvider, useCompanyContext } from 'context/companyContext';
import * as React from 'react';
import Spinner from 'components/Spinner/Spinner';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { useUserContext } from 'context/userContext';
import CmsNav from 'layout/CmsLayout/CmsNav';
import { useAppContext } from 'context/appContext';
import Meta, { PageUrlsInterface } from '../Meta';
import Modal from 'components/Modal/Modal';
import useCompact from 'hooks/useCompact';

interface AppLayoutInterface {
  description?: string;
  title?: string;
  pageUrls: PageUrlsInterface;
}

const narrowContentClass = 'wp-desktop:pl-[220px]';
const wideContentClass = 'wp-desktop:pl-[60px]';

const AppLayoutConsumer: React.FC<AppLayoutInterface> = ({ children, pageUrls, title }) => {
  const { isLoading, isModal, isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;
  const { state } = useUserContext();
  const { company } = useCompanyContext();

  if (!state.me) {
    return <Spinner />;
  }

  const { appNavigation } = state.me.role;
  console.log(company);
  return (
    <div className={`relative z-[1] min-h-full-height text-primary-text bg-primary-background`}>
      <Meta title={title} pageUrls={pageUrls} />

      <CmsNav compact={compact} navItems={appNavigation} />

      <main
        className={`relative z-[1] min-h-full-height pt-[36px] wp-desktop:pt-0 ${
          isCompact ? wideContentClass : narrowContentClass
        }`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {isLoading ? <Spinner /> : null}
      {isModal.show ? <Modal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

const AppLayout: React.FC<AppLayoutInterface> = ({ children, pageUrls, title }) => {
  const { state } = useUserContext();

  if (!state.me) {
    return <Spinner />;
  }

  return (
    <CompanyContextProvider>
      <AppLayoutConsumer pageUrls={pageUrls} title={title}>
        {children}
      </AppLayoutConsumer>
    </CompanyContextProvider>
  );
};

export default AppLayout;
