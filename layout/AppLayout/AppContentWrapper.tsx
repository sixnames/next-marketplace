import * as React from 'react';

const AppContentWrapper: React.FC = ({ children }) => {
  return <div className={'pt-11 pb-11'}>{children}</div>;
};

export default AppContentWrapper;
