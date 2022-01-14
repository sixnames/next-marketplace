import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import { ROUTE_BLOG } from '../../../../../config/common';

export default function RedirectPage() {
  return <div />;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> => {
  const { query } = context;

  return {
    redirect: {
      destination: `${ROUTE_BLOG}/post/${query.blogPostSlug}`,
      permanent: true,
    },
  };
};
