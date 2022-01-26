import * as React from 'react';

const HorizontalScroll: React.FC = ({ children }) => {
  return (
    <div className='relative'>
      <div className='relative overflow-x-auto'>
        <div className='flex items-stretch gap-4'>
          {children}
          <div className='h-1 min-w-[3rem] sm:min-w-[7rem]' />
        </div>
      </div>
      <div className='absolute inset-y-0 right-0 z-30 h-full w-[10%] bg-gradient-to-l from-primary to-primary-transparent' />
    </div>
  );
};

export default HorizontalScroll;
