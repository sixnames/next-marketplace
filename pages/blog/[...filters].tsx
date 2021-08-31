import { BlogPostInterface } from 'db/uiInterfaces';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface BlogListPageConsumerInterface {
  posts: BlogPostInterface[];
}

interface BlogListPageInterface
  extends SiteLayoutProviderInterface,
    BlogListPageConsumerInterface {}

const BlogListPage: React.FC<BlogListPageInterface> = ({ ...props }) => {
  return (
    <SiteLayout {...props}>
      <div />
    </SiteLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogListPageInterface>> => {
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props || !props.initialData.configs.showBlog) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      posts: [],
    },
  };
};

export default BlogListPage;
