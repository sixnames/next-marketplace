import ControlButton from 'components/ControlButton';
import ErrorBoundary from 'components/ErrorBoundary';
import Modal from 'components/Modal/Modal';
import Spinner from 'components/Spinner';
import ThemeTrigger from 'components/ThemeTrigger';
import { useAppContext } from 'context/appContext';
import { useUserContext } from 'context/userContext';
import { CompanyInterface } from 'db/uiInterfaces';
import useCompact from 'hooks/useCompact';
import CmsNav from 'layout/CmsLayout/CmsNav';
import Meta, { PageUrlsInterface } from 'layout/Meta';
import { useRouter } from 'next/router';
import * as React from 'react';

interface CmsWrapperInterface {
  title?: string;
  pageUrls: PageUrlsInterface;
  company?: CompanyInterface;
}

const narrowContentClass = 'lg:pl-[250px]';
const wideContentClass = 'lg:pl-[60px]';

const CmsWrapper: React.FC<CmsWrapperInterface> = ({ title, company, pageUrls, children }) => {
  const { isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const router = useRouter();
  const { isLoading, isModal } = useAppContext();
  const { me } = useUserContext();
  const { isCompact, toggleCompactHandler } = compact;

  if (!me) {
    return <Spinner />;
  }

  return (
    <div className={`min-h-full-height text-primary-text bg-primary`}>
      <Meta title={title} pageUrls={pageUrls} />

      {/*top bar*/}
      <div className='fixed top-0 z-30 inset-x-0 flex items-center justify-between h-[60px] shadow-md bg-[#2B3039]'>
        <div className='flex items-center text-white gap-2 pl-[5px]'>
          <ControlButton icon={'burger'} className='text-white' onClick={toggleCompactHandler} />
          <div className='font-medium'>{me.shortName}</div>
        </div>

        <div className='flex items-center text-white gap-1 pr-[5px]'>
          <ThemeTrigger staticColors />
          <ControlButton
            icon={'exit'}
            testId={'sign-out'}
            className='text-white'
            onClick={() => {
              router.push('/').catch(console.log);
            }}
          />
        </div>
      </div>

      {/*content*/}
      <main
        className={`relative min-h-full-height z-10 pt-[60px] ${
          isCompact ? wideContentClass : narrowContentClass
        }`}
      >
        <ErrorBoundary>
          <div>{children}</div>
        </ErrorBoundary>
      </main>

      {/*nav*/}
      <CmsNav
        isMobile={isMobile}
        compact={compact}
        company={company}
        basePath={''}
        navItems={me.role?.cmsNavigation || []}
      />

      {isLoading ? <Spinner /> : null}
      {isModal.show ? <Modal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

export default CmsWrapper;
