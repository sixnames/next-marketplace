import Breadcrumbs, { BreadcrumbsInterface } from 'components/Breadcrumbs';
import * as React from 'react';

export type AppContentWrapperBreadCrumbs = Omit<
  BreadcrumbsInterface,
  'noMainPage' | 'lowWrapper' | 'lowBottom'
>;

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
        <Breadcrumbs
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
