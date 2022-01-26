import * as React from 'react';

interface SpinnerInterface {
  className?: string;
  isNested?: boolean;
  isNestedAbsolute?: boolean;
  isTransparent?: boolean;
}

const Spinner: React.FC<SpinnerInterface> = ({
  className,
  isNested,
  isNestedAbsolute,
  isTransparent,
}) => {
  return (
    <div
      className={`z-[9999] flex w-full items-center justify-center ${
        isTransparent ? '' : 'bg-gray-700 bg-opacity-30'
      } ${
        isNested
          ? 'relative h-[200px]'
          : isNestedAbsolute
          ? 'absolute inset-0 h-full min-h-[10rem] w-full'
          : 'fixed inset-0 h-full-height'
      }
      } ${className ? className : ''}`}
    >
      <svg className='spinner-circular'>
        <circle
          className='spinner-path'
          cx='50'
          cy='50'
          r='20'
          fill='none'
          strokeWidth='3'
          strokeMiterlimit='10'
        />
      </svg>
    </div>
  );
};

export default Spinner;
