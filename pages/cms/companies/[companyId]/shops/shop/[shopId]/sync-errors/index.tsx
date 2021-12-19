import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { DEFAULT_PAGE_FILTER, ROUTE_CMS } from '../../../../../../../../config/common';

const SyncIndexErrors: NextPage = () => {
  return <div />;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { query } = context;
  return {
    redirect: {
      permanent: true,
      destination: `${ROUTE_CMS}/companies/${query.companyId}/shops/shop/${query.shopId}/sync-errors/${DEFAULT_PAGE_FILTER}`,
    },
  };
};

export default SyncIndexErrors;
