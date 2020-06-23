import React from 'react';
import Inner from './Inner';

interface InnerWideInterface {
  lowTop?: boolean;
  lowBottom?: boolean;
  className?: string;
  testId?: string;
}

const InnerWide: React.FC<InnerWideInterface> = ({ children, testId, ...props }) => {
  return (
    <Inner {...props} wide testId={testId}>
      {children}
    </Inner>
  );
};

export default InnerWide;
