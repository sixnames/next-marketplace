import BlogPostsDetails from 'components/blog/BlogPostsDetails';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_BLOG, ROUTE_CONSOLE } from 'config/common';
import { getBlogPost } from 'db/dao/blog/getBlogPost';
import {
  AppContentWrapperBreadCrumbs,
  BlogAttributeInterface,
  BlogPostInterface,
  CompanyInterface,
} from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import * as React from 'react';

interface BlogPostConsumerInterface {
  post: BlogPostInterface;
  attributes: BlogAttributeInterface[];
  pageCompany: CompanyInterface;
}

const pageTitle = 'Блог';

const BlogPostConsumer: React.FC<BlogPostConsumerInterface> = ({
  post,
  pageCompany,
  attributes,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${post.title}`,
    config: [
      {
        name: pageTitle,
        href: `${ROUTE_CONSOLE}/${pageCompany?._id}${ROUTE_BLOG}`,
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

interface BlogPostPageInterface
  extends GetConsoleInitialDataPropsInterface,
    BlogPostConsumerInterface {}

const BlogPostPage: React.FC<BlogPostPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <BlogPostConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
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
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default BlogPostPage;
