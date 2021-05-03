import AppNav from 'layout/AppLayout/AppNav';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import Spinner from 'components/Spinner/Spinner';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { useUserContext } from 'context/userContext';
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
  const router = useRouter();
  const { isLoading, isModal, isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;
  const { me } = useUserContext();

  React.useEffect(() => {
    if (noNaN(me?.companies?.length) < 1) {
      router.push('/').catch((e) => console.log(e));
    }
  }, [me, router]);

  if (!me) {
    return <Spinner />;
  }

  return (
    <div className={`relative z-[1] min-h-full-height text-primary-text bg-primary`}>
      <Meta title={title} pageUrls={pageUrls} />

      <AppNav compact={compact} navItems={me.role?.appNavigation || []} />

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
  return (
    <AppLayoutConsumer pageUrls={pageUrls} title={title}>
      {children}
    </AppLayoutConsumer>
  );
};

export default AppLayout;
