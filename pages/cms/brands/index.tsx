import * as React from 'react';
import { ROUTE_CMS } from '../../../config/common';

const BrandsIndex: React.FC = () => {
  return <div />;
};

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: true,
      destination: `${ROUTE_CMS}/brands/page-1`,
    },
  };
};

export default BrandsIndex;
