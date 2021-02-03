import * as React from 'react';

const IconMarker: React.FC = (props) => {
  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      width='28'
      height='32'
      viewBox='0 0 28 32'
      {...props}
    >
      <path d='M13.534 31.7l0.684 0.3 0.684-0.3c0.019-0.010 0.052-0.027 0.098-0.050 1.31-0.667 13.218-6.73 13.218-18.621 0-7.205-6.284-13.028-14-13.028s-14 5.824-14 13.028c0 11.892 11.908 17.954 13.218 18.621 0.046 0.023 0.079 0.040 0.098 0.050zM3.33 13.028c0-5.523 4.916-10.026 10.889-10.026s10.889 4.503 10.889 10.026c0 4.323-1.867 8.285-5.662 11.827-2.116 1.921-4.169 3.242-5.227 3.782-2.489-1.381-10.889-6.664-10.889-15.61zM8.37 12.848c0 3.122 2.613 5.643 5.849 5.643s5.849-2.521 5.849-5.643c0-3.122-2.613-5.644-5.849-5.644s-5.849 2.522-5.849 5.644zM11.481 12.848c0-1.441 1.244-2.642 2.738-2.642s2.738 1.201 2.738 2.642c0 1.441-1.244 2.642-2.738 2.642s-2.738-1.201-2.738-2.642z' />
    </svg>
  );
};

export default IconMarker;