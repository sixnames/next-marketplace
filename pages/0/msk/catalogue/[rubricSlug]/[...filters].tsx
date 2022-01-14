import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

export default function RedirectPage() {
  return <div />;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> => {
  return {
    redirect: {
      destination: context.resolvedUrl.replace('/0/msk', ''),
      permanent: true,
    },
  };
};
