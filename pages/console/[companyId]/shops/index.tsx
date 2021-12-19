import { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { ROUTE_CONSOLE } from '../../../../config/common';

const ShopsIndex: React.FC = () => {
  return <div />;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { query } = context;
  return {
    redirect: {
      permanent: false,
      destination: `${ROUTE_CONSOLE}/${query.companyId}/shops/page-1`,
    },
  };
};

export default ShopsIndex;
