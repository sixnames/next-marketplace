import Breadcrumbs, { BreadcrumbsInterface } from 'components/Breadcrumbs';
import * as React from 'react';

interface AppContentWrapperInterface {
  testId?: string | number;
  breadcrumbs?: BreadcrumbsInterface;
}

const AppContentWrapper: React.FC<AppContentWrapperInterface> = ({
  children,
  breadcrumbs,
  testId,
}) => {
  return (
    <div data-cy={testId} className={`${breadcrumbs ? '' : 'pt-12'} pb-11`}>
      {breadcrumbs ? (
        <Breadcrumbs currentPageName={breadcrumbs.currentPageName} config={breadcrumbs.config} />
      ) : null}
      {children}
    </div>
  );
};

export default AppContentWrapper;
