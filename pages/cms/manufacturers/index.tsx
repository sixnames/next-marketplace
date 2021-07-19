import { ROUTE_CMS } from 'config/common';
import * as React from 'react';

const ManufacturersIndex: React.FC = () => {
  return <div />;
};

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: true,
      destination: `${ROUTE_CMS}/manufacturers/page-1`,
    },
  };
};

export default ManufacturersIndex;
