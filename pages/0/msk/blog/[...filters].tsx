import { GetServerSidePropsResult } from 'next';
import * as React from 'react';
import { ROUTE_BLOG } from '../../../../config/common';

export default function RedirectPage() {
  return <div />;
}

export const getServerSideProps = (): GetServerSidePropsResult<any> => {
  return {
    redirect: {
      destination: ROUTE_BLOG,
      permanent: true,
    },
  };
};
