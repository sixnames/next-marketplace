import * as React from 'react';
import { NextPage } from 'next';
import { DEFAULT_PAGE_FILTER, ROUTE_CMS } from '../../../config/common';

const SyncIndexErrors: NextPage = () => {
  return <div />;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      permanent: true,
      destination: `${ROUTE_CMS}/sync-errors/${DEFAULT_PAGE_FILTER}`,
    },
  };
};

export default SyncIndexErrors;
