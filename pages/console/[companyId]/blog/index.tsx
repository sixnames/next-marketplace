import BlogPostsList from 'components/blog/BlogPostsList';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { getBlogPostsList } from 'db/dao/blog/getBlogPostsList';
import { BlogPostInterface, CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import * as React from 'react';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
  pageCompany: CompanyInterface;
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({
  posts,
  pageCompany,
}) => {
  const basePath = `${ROUTE_CONSOLE}/${pageCompany?._id}`;

  return (
    <AppContentWrapper>
      <Inner testId={'company-posts-list'}>
        <Title>{pageTitle}</Title>
        <BlogPostsList posts={posts} basePath={basePath} companySlug={`${pageCompany?.slug}`} />
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({ posts, layoutProps }) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <BlogPostsListConsumer posts={posts} pageCompany={layoutProps.pageCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostsListPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props || !context.query.companyId) {
    return {
      notFound: true,
    };
  }

  const posts = await getBlogPostsList({
    locale: props.sessionLocale,
    companySlug: `${props.layoutProps.pageCompany?.slug}`,
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default BlogPostsListPage;
