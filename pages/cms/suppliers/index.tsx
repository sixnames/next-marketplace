import { ROUTE_CMS } from 'config/common';
import * as React from 'react';

const SuppliersIndex: React.FC = () => {
  return <div />;
};

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: true,
      destination: `${ROUTE_CMS}/suppliers/page-1`,
    },
  };
};

export default SuppliersIndex;
