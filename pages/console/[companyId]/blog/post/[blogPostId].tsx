import BlogPostsDetails from 'components/blog/BlogPostsDetails';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_BLOG, ROUTE_CONSOLE } from 'config/common';
import { getBlogPost } from 'db/dao/blog/getBlogPost';
import { BlogAttributeInterface, BlogPostInterface, CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface BlogPostConsumerInterface {
  post: BlogPostInterface;
  attributes: BlogAttributeInterface[];
  currentCompany?: CompanyInterface | null;
}

const pageTitle = 'Блог';

const BlogPostConsumer: React.FC<BlogPostConsumerInterface> = ({
  post,
  currentCompany,
  attributes,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${post.title}`,
    config: [
      {
        name: pageTitle,
        href: `${ROUTE_CONSOLE}/${currentCompany?._id}${ROUTE_BLOG}`,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Inner testId={'company-post-details'}>
        <Title>{post.title}</Title>
        <BlogPostsDetails attributes={attributes} post={post} />
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostPageInterface extends PagePropsInterface, BlogPostConsumerInterface {}

const BlogPostPage: React.FC<BlogPostPageInterface> = ({
  post,
  pageUrls,
  pageCompany,
  attributes,
}) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} title={pageTitle} company={pageCompany}>
      <BlogPostConsumer post={post} attributes={attributes} currentCompany={pageCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.pageCompany || !context.query.companyId) {
    return {
      notFound: true,
    };
  }

  const payload = await getBlogPost({
    locale: props.sessionLocale,
    blogPostId: `${context.query.blogPostId}`,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      post: castDbData(payload.post),
      attributes: castDbData(payload.attributes),
      pageCompany: props.pageCompany,
    },
  };
};

export default BlogPostPage;
