import * as React from 'react';
import { GetServerSidePropsResult } from 'next';
import { ROUTE_CONTACTS } from '../../../config/common';

export default function RedirectPage() {
  return <div />;
}

export const getServerSideProps = async (): Promise<GetServerSidePropsResult<any>> => {
  return {
    redirect: {
      destination: ROUTE_CONTACTS,
      permanent: true,
    },
  };
};
