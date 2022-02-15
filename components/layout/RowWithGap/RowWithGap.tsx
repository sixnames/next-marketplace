import * as React from 'react';

interface RowWithGapInterface {
  low?: boolean;
  className?: string;
}

const RowWithGap: React.FC<RowWithGapInterface> = ({ low, className, children }) => {
  return <div className={`${low ? '' : 'mb-8'} ${className ? className : ''}`}>{children}</div>;
};

export default RowWithGap;
