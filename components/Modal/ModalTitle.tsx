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
      className={`wp-desktop:flex wp-desktop:items-center wp-desktop:justify-between ${
        low ? '' : 'mb-6'
      } ${className ? className : null}`}
    >
      <div>
        <div
          className={`font-medium ${
            size === 'small' ? 'text-2xl wp-desktop:text-3xl' : 'text-3xl wp-desktop:text-4xl'
          }`}
        >
          {children}
        </div>
        {subtitle ? <div className='text-secondary-text mt-4'>{subtitle}</div> : null}
      </div>

      {right && <div className='mt-3 wp-desktop:mt-0'>{right}</div>}
    </div>
  );
};

export default ModalTitle;
