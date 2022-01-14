import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

export default function RedirectPage() {
  return <div />;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> => {
  const { query } = context;

  return {
    redirect: {
      destination: `/${query.card}`,
      permanent: true,
    },
  };
};
