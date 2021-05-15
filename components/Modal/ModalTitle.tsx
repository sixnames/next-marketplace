import * as React from 'react';
import { SizeType } from 'types/clientTypes';

interface ModalTitleInterface {
  className?: string;
  right?: React.ReactChild;
  subtitle?: any;
  size?: SizeType;
  low?: boolean;
}

const ModalTitle: React.FC<ModalTitleInterface> = ({
  children,
  size = 'normal',
  className,
  right,
  subtitle,
  low,
}) => {
  return (
    <div
      className={`lg:flex lg:items-center lg:justify-between ${low ? '' : 'mb-6'} ${
        className ? className : null
      }`}
    >
      <div>
        <div
          className={`font-medium ${
            size === 'small' ? 'text-2xl lg:text-3xl' : 'text-3xl lg:text-4xl'
          }`}
        >
          {children}
        </div>
        {subtitle ? <div className='text-secondary-text mt-4'>{subtitle}</div> : null}
      </div>

      {right && <div className='mt-3 lg:mt-0'>{right}</div>}
    </div>
  );
};

export default ModalTitle;
