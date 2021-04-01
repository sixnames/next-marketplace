import { useRouter } from 'next/router';
import * as React from 'react';
import Spinner from 'components/Spinner/Spinner';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { useUserContext } from 'context/userContext';
import AppNav from './AppNav';
import { useAppContext } from 'context/appContext';
import Meta, { PageUrlsInterface } from '../Meta';
import Modal from 'components/Modal/Modal';
import classes from './AppLayout.module.css';
import useCompact from 'hooks/useCompact';

interface AppLayoutInterface {
  description?: string;
  title?: string;
  pageUrls: PageUrlsInterface;
}

const AppLayout: React.FC<AppLayoutInterface> = ({ children, pageUrls, title }) => {
  const { pathname } = useRouter();
  const { isLoading, isModal, isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;
  const { state } = useUserContext();

  if (!state.me) {
    return <Spinner />;
  }

  const { appNavigation, cmsNavigation } = state.me.role;
  const navItems = pathname.includes('cms') ? cmsNavigation : appNavigation;

  return (
    <div className={classes.frame}>
      <Meta title={title} pageUrls={pageUrls} />

      <AppNav compact={compact} navItems={navItems} />

      <main className={`${classes.content} ${isCompact ? classes.contentCompact : ''}`}>
        <ErrorBoundary>
          <div>{children}</div>
        </ErrorBoundary>
      </main>

      {isLoading ? <Spinner /> : null}
      {isModal.show ? <Modal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

export default AppLayout;
