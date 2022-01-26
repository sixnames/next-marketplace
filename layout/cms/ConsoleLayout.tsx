import { useRouter } from 'next/router';
import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import ErrorBoundary from '../../components/ErrorBoundary';
import LanguageTrigger from '../../components/LanguageTrigger';
import WpModal from '../../components/Modal/WpModal';
import Spinner from '../../components/Spinner';
import ThemeTrigger from '../../components/ThemeTrigger';
import { ROUTE_CONSOLE } from '../../config/common';
import { useAppContext } from '../../context/appContext';
import { useConfigContext } from '../../context/configContext';
import { UserContextProvider, useUserContext } from '../../context/userContext';
import { SessionUserPayloadInterface } from '../../db/dao/user/getPageSessionUser';
import { CompanyInterface } from '../../db/uiInterfaces';
import useCompact from '../../hooks/useCompact';
import Meta from '../Meta';
import CmsNav from './CmsNav';

interface ConsoleLayoutConsumerInterface {
  title?: string;
  pageCompany?: CompanyInterface | null;
}

const narrowContentClass = 'lg:pl-[250px]';
const wideContentClass = 'lg:pl-[60px]';

const ConsoleLayoutConsumer: React.FC<ConsoleLayoutConsumerInterface> = ({
  title,
  pageCompany,
  children,
}) => {
  const { isMobile } = useAppContext();
  const compact = useCompact(isMobile);
  const router = useRouter();
  const { isLoading, isModal } = useAppContext();
  const { sessionUser } = useUserContext();
  const { isCompact, toggleCompactHandler } = compact;
  const { configs } = useConfigContext();

  if (!sessionUser) {
    return <Spinner />;
  }

  const navItems = pageCompany ? sessionUser.role?.appNavigation : sessionUser.role?.cmsNavigation;
  const basePath = pageCompany ? `${ROUTE_CONSOLE}/${pageCompany._id}` : '';

  // Metrics
  const yaMetrica = configs.yaMetrica;
  const googleAnalytics = configs.googleAnalytics;

  return (
    <div className={`min-h-full-height bg-primary text-primary-text`}>
      <Meta title={title} showForIndex={false} />
      <div dangerouslySetInnerHTML={{ __html: `${yaMetrica}${googleAnalytics}` }} />

      {/*top bar*/}
      <div className='fixed inset-x-0 top-0 z-30 flex h-[60px] items-center justify-between bg-[#2B3039] shadow-md'>
        <div className='flex items-center gap-2 pl-[5px] text-white'>
          <ControlButton icon={'burger'} className='text-white' onClick={toggleCompactHandler} />
          <div className='font-medium'>{sessionUser.shortName}</div>
        </div>

        <div className='flex items-center gap-1 pr-[5px] text-white'>
          <div className='mr-4'>
            <LanguageTrigger />
          </div>
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
        className={`relative z-10 min-h-full-height pt-[60px] ${
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
        pageCompany={pageCompany}
        basePath={basePath}
        navItems={navItems || []}
      />

      {isLoading ? <Spinner /> : null}
      {isModal.show ? <WpModal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

export interface ConsoleLayoutInterface extends ConsoleLayoutConsumerInterface {
  sessionUser: SessionUserPayloadInterface;
}

const ConsoleLayout: React.FC<ConsoleLayoutInterface> = ({ sessionUser, ...props }) => {
  return (
    <UserContextProvider sessionUser={sessionUser?.me}>
      <ConsoleLayoutConsumer {...props} />
    </UserContextProvider>
  );
};

export default ConsoleLayout;
