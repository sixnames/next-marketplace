import * as React from 'react';

const HorizontalScroll: React.FC = ({ children }) => {
  return (
    <div className='relative'>
      <div className='overflow-x-auto relative'>
        <div className='flex gap-4 items-stretch'>
          {children}
          <div className='h-1 min-w-[3rem] sm:min-w-[7rem]' />
        </div>
      </div>
      <div className='z-30 absolute inset-y-0 right-0 h-full w-[10%] bg-gradient-to-l from-primary to-primary-transparent' />
    </div>
  );
};

export default HorizontalScroll;
