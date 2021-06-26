import * as React from 'react';
import { noNaN } from 'lib/numbers';

interface PercentInterface {
  value?: string | number | null;
  className?: string;
  isNegative?: boolean;
}

const Percent: React.FC<PercentInterface> = ({ value, className, isNegative }) => {
  if (!value) {
    return null;
  }

  return (
    <span className={`${className ? className : ''}`}>
      <span>{`${isNegative ? '-' : ''}${noNaN(value)}`}</span>%
    </span>
  );
};

export default Percent;
