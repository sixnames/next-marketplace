import * as React from 'react';

const IconPencil: React.FC = (props) => {
  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 32 32'
      {...props}
    >
      <path d='M24.291 0.294c0.181-0.181 0.431-0.294 0.708-0.294s0.527 0.112 0.708 0.294l6 6c0.181 0.181 0.294 0.431 0.294 0.708s-0.112 0.527-0.294 0.708l-19.999 19.999c-0.093 0.093-0.205 0.167-0.329 0.218l-0.007 0.002-10 4c-0.11 0.045-0.238 0.072-0.372 0.072-0.552 0-1-0.448-1-1 0-0.134 0.026-0.262 0.074-0.378l-0.002 0.007 4-10c0.053-0.131 0.127-0.243 0.22-0.336l19.999-19.999zM22.413 5.002l4.586 4.586 2.586-2.586-4.586-4.586-2.586 2.586zM25.584 11.001l-4.586-4.586-12.999 12.999v0.586h1c0.552 0 1 0.448 1 1v0 1h1c0.552 0 1 0.448 1 1v0 1h0.586l12.999-12.999zM6.063 21.351l-0.212 0.212-3.056 7.642 7.642-3.056 0.212-0.212c-0.383-0.146-0.65-0.51-0.65-0.936v-1h-1c-0.552 0-1-0.448-1-1v0-1h-1c-0.426-0-0.79-0.267-0.934-0.643l-0.002-0.007z' />
    </svg>
  );
};

export default IconPencil;