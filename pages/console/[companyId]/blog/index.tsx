import BlogPostsList from 'components/blog/BlogPostsList';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTitle from 'components/WpTitle';
import { getBlogPostsList } from 'db/ssr/blog/getBlogPostsList';
import { BlogPostInterface, CompanyInterface } from 'db/uiInterfaces';

import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
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
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
  });

  return (
    <AppContentWrapper>
      <Inner testId={'company-posts-list'}>
        <WpTitle>{pageTitle}</WpTitle>
        <BlogPostsList posts={posts} basePath={links.root} companySlug={`${pageCompany?.slug}`} />
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
