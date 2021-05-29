import { ROUTE_CMS } from 'config/common';
import * as React from 'react';

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
