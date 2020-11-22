import React from 'react';
import { noNaN } from '@yagu/shared';

interface PercentInterface {
  value: string | number | null;
  className?: string;
  isNegative?: boolean;
}

const Percent: React.FC<PercentInterface> = ({ value, className, isNegative }) => {
  return (
    <span className={`${className ? className : ''}`}>
      <span>{`${isNegative ? '-' : ''}${noNaN(value)}`}</span>%
    </span>
  );
};

export default Percent;
