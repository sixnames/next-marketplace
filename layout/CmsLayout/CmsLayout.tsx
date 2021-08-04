import * as React from 'react';
import Spinner from 'components/Spinner';
import ErrorBoundary from 'components/ErrorBoundary';
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

const narrowContentClass = 'lg:pl-[250px]';
const wideContentClass = 'lg:pl-[60px]';

const CmsLayout: React.FC<AppLayoutInterface> = ({ children, pageUrls, title }) => {
  const { isLoading, isModal, isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;
  const { me } = useUserContext();

  if (!me) {
    return <Spinner />;
  }

  return (
    <div className={`min-h-full-height text-primary-text bg-primary`}>
      <Meta title={title} pageUrls={pageUrls} />

      <CmsNav compact={compact} basePath={''} navItems={me.role?.cmsNavigation || []} />

      <main
        className={`min-h-full-height pt-[36px] lg:pt-0 ${
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
