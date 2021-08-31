import BlogPostsList from 'components/blog/BlogPostsList';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { getBlogPostsList } from 'db/dao/blog/getBlogPostsList';
import { BlogPostInterface } from 'db/uiInterfaces';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({ posts }) => {
  return (
    <BlogPostsList
      posts={posts}
      pageTitle={pageTitle}
      basePath={ROUTE_CMS}
      companySlug={DEFAULT_COMPANY_SLUG}
    />
  );
};

interface BlogPostsListPageInterface extends PagePropsInterface, BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({ posts, pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <BlogPostsListConsumer posts={posts} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostsListPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const posts = await getBlogPostsList({
    locale: props.sessionLocale,
    companySlug: props.companySlug,
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
    },
  };
};

export default BlogPostsListPage;
