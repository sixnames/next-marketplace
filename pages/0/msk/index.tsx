import * as React from 'react';
import { GetServerSidePropsResult } from 'next';

export default function RedirectPage() {
  return <div />;
}

export const getServerSideProps = async (): Promise<GetServerSidePropsResult<any>> => {
  return {
    redirect: {
      destination: `/`,
      permanent: true,
    },
  };
};
