import { ROUTE_CONSOLE } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import CmsNav from 'layout/CmsLayout/CmsNav';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import Spinner from 'components/Spinner';
import ErrorBoundary from 'components/ErrorBoundary';
import { useUserContext } from 'context/userContext';
import { useAppContext } from 'context/appContext';
import Meta, { PageUrlsInterface } from '../Meta';
import Modal from 'components/Modal/Modal';
import useCompact from 'hooks/useCompact';

interface ConsoleLayoutInterface {
  description?: string;
  title?: string;
  pageUrls: PageUrlsInterface;
  company?: CompanyInterface | null;
}

const narrowContentClass = 'lg:pl-[220px]';
const wideContentClass = 'lg:pl-[60px]';

const ConsoleLayoutConsumer: React.FC<ConsoleLayoutInterface> = ({
  children,
  company,
  pageUrls,
  title,
}) => {
  const router = useRouter();
  const { isLoading, isModal, isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const { isCompact } = compact;
  const { me } = useUserContext();

  React.useEffect(() => {
    if (noNaN(me?.companies?.length) < 1) {
      router.push('/').catch((e) => console.log(e));
    }
  }, [me, router, company]);

  if (!me || !company) {
    return <Spinner />;
  }

  return (
    <div className={`relative z-[1] min-h-full-height text-primary-text bg-primary`}>
      <Meta title={title} pageUrls={pageUrls} />

      <CmsNav
        compact={compact}
        basePath={`${ROUTE_CONSOLE}/${company._id}`}
        navItems={me.role?.appNavigation || []}
        company={company}
      />

      <main
        className={`relative z-[1] min-h-full-height pt-[36px] lg:pt-0 ${
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

const ConsoleLayout: React.FC<ConsoleLayoutInterface> = ({
  children,
  company,
  pageUrls,
  title,
}) => {
  return (
    <ConsoleLayoutConsumer pageUrls={pageUrls} title={title} company={company}>
      {children}
    </ConsoleLayoutConsumer>
  );
};

export default ConsoleLayout;
