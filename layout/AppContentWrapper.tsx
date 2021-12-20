import * as React from 'react';
import WpBreadcrumbs from '../components/WpBreadcrumbs';
import { AppContentWrapperBreadCrumbs } from '../db/uiInterfaces';

interface AppContentWrapperInterface {
  testId?: string | number;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const AppContentWrapper: React.FC<AppContentWrapperInterface> = ({
  children,
  breadcrumbs,
  testId,
}) => {
  return (
    <div data-cy={testId} className={`${breadcrumbs ? '' : 'pt-12'} pb-11`}>
      {breadcrumbs ? (
        <WpBreadcrumbs
          currentPageName={breadcrumbs.currentPageName}
          config={breadcrumbs.config}
          noMainPage={true}
          lowWrapper={true}
          lowBottom={true}
        />
      ) : null}
      {children}
    </div>
  );
};

export default AppContentWrapper;
