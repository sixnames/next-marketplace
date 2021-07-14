import { ROUTE_CONSOLE } from 'config/common';
import { GetServerSidePropsContext } from 'next';
import * as React from 'react';

const CustomersIndex: React.FC = () => {
  return <div />;
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { query } = context;
  const companyId = query.companyId;

  if (!companyId) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      permanent: true,
      destination: `${ROUTE_CONSOLE}/${companyId}/customers/page-1`,
    },
  };
};

export default CustomersIndex;
