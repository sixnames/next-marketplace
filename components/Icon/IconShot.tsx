import * as React from 'react';

const IconShot: React.FC = (props) => {
  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 32 32'
      {...props}
    >
      <path
        fill='none'
        strokeLinejoin='miter'
        strokeLinecap='butt'
        strokeMiterlimit='4'
        strokeWidth='0.4706'
        stroke='#000'
        d='M31.75 16c0 8.698-7.052 15.75-15.75 15.75s-15.75-7.052-15.75-15.75c0-8.698 7.051-15.75 15.75-15.75s15.75 7.051 15.75 15.75z'
      />
      <path d='M30.104 16c0 7.79-6.315 14.104-14.104 14.104s-14.104-6.315-14.104-14.104c0-7.79 6.315-14.104 14.104-14.104s14.104 6.315 14.104 14.104z' />
    </svg>
  );
};

export default IconShot;
