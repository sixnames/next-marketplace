import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import { ROUTE_BLOG } from '../../../config/common';
import { getSiteInitialData } from '../../../lib/ssrUtils';

const BlogPostPage: React.FC = () => {
  return <div />;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> => {
  const { query } = context;
  const { blogPostSlug } = query;
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    redirect: {
      destination: `${props.urlPrefix}${ROUTE_BLOG}/post/${blogPostSlug}`,
      permanent: true,
    },
  };
};

export default BlogPostPage;
