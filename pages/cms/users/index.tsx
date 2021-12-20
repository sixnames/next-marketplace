import * as React from 'react';
import { ROUTE_CMS } from '../../../config/common';

const UserIndex: React.FC = () => {
  return <div />;
};

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: true,
      destination: `${ROUTE_CMS}/users/page-1`,
    },
  };
};

export default UserIndex;
