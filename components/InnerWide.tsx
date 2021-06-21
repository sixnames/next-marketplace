import * as React from 'react';
import Inner, { InnerInterface } from 'components/Inner';

type InnerWideInterface = Omit<InnerInterface, 'wide'>;

const InnerWide: React.FC<InnerWideInterface> = ({ children, testId, ...props }) => {
  return (
    <Inner {...props} wide testId={testId}>
      {children}
    </Inner>
  );
};

export default InnerWide;
