import BlogPostsList from 'components/blog/BlogPostsList';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { getBlogPostsList } from 'db/dao/blog/getBlogPostsList';
import { BlogPostInterface, CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
  currentCompany?: CompanyInterface | null;
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({
  posts,
  currentCompany,
}) => {
  const basePath = `${ROUTE_CONSOLE}/${currentCompany?._id}`;

  return (
    <AppContentWrapper>
      <Inner testId={'company-posts-list'}>
        <Title>{pageTitle}</Title>
        <BlogPostsList posts={posts} basePath={basePath} companySlug={`${currentCompany?.slug}`} />
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostsListPageInterface extends PagePropsInterface, BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({
  posts,
  pageUrls,
  pageCompany,
}) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} title={pageTitle} company={pageCompany}>
      <BlogPostsListConsumer posts={posts} currentCompany={pageCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostsListPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.pageCompany || !context.query.companyId) {
    return {
      notFound: true,
    };
  }

  const posts = await getBlogPostsList({
    locale: props.sessionLocale,
    companySlug: `${props.pageCompany?.slug}`,
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
      pageCompany: props.pageCompany,
    },
  };
};

export default BlogPostsListPage;
