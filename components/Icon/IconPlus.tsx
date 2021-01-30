import * as React from 'react';

const IconPlus: React.FC = (props) => {
  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 32 32'
      {...props}
    >
      <path d='M16 0c1.105 0 2 0.895 2 2v0 12h12c1.105 0 2 0.895 2 2s-0.895 2-2 2v0h-12v12c0 1.105-0.895 2-2 2s-2-0.895-2-2v0-12h-12c-1.105 0-2-0.895-2-2s0.895-2 2-2v0h12v-12c0-1.105 0.895-2 2-2v0z' />
    </svg>
  );
};

export default IconPlus;
