import { ROUTE_BLOG } from 'config/common';
import { alwaysArray } from 'lib/arrayUtils';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

const BlogListPage: React.FC = () => {
  return <div />;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> => {
  const { props } = await getSiteInitialData({
    context,
  });

  const filters = alwaysArray(context.query.filters);
  const filtersPath = filters.join('/');
  return {
    redirect: {
      destination: `${props.urlPrefix}${ROUTE_BLOG}/${filtersPath}`,
      permanent: true,
    },
  };
};

export default BlogListPage;
