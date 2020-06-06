import React from 'react';
import Inner from './Inner';

interface InnerWideInterface {
  lowTop?: boolean;
  lowBottom?: boolean;
  className?: string;
}

const InnerWide: React.FC<InnerWideInterface> = ({ children, ...props }) => {
  return (
    <Inner {...props} wide>
      {children}
    </Inner>
  );
};

export default InnerWide;
