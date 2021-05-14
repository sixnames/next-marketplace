import * as React from 'react';

interface AppContentWrapperInterface {
  testId?: string | number;
}

const AppContentWrapper: React.FC<AppContentWrapperInterface> = ({ children, testId }) => {
  return (
    <div data-cy={testId} className={'pt-11 pb-11'}>
      {children}
    </div>
  );
};

export default AppContentWrapper;
