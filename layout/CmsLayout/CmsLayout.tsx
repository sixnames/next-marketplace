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

const CmsLayout: React.FC<AppLayoutInterface> = ({ children, pageUrls, title }) => {
  const { isLoading, isModal, isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;
  const { state } = useUserContext();

  if (!state.me) {
    return <Spinner />;
  }

  const { cmsNavigation } = state.me.role;

  return (
    <div className={`relative z-[1] min-h-full-height text-primary-text bg-primary-background`}>
      <Meta title={title} pageUrls={pageUrls} />

      <CmsNav compact={compact} navItems={cmsNavigation} />

      <main
        className={`relative z-[1] min-h-full-height pt-[36px] wp-desktop:pt-0 ${
          isCompact ? wideContentClass : narrowContentClass
        }`}
      >
        <ErrorBoundary>
          <div>{children}</div>
        </ErrorBoundary>
      </main>

      {isLoading ? <Spinner /> : null}
      {isModal.show ? <Modal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

export default CmsLayout;
