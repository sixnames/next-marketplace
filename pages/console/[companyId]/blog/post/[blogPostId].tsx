import BlogPostsDetails from 'components/blog/BlogPostsDetails';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTitle from 'components/WpTitle';
import { getBlogPost } from 'db/ssr/blog/getBlogPost';
import {
  AppContentWrapperBreadCrumbs,
  BlogAttributeInterface,
  BlogPostInterface,
  CompanyInterface,
} from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
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
  const links = getProjectLinks({
    companyId: pageCompany._id,
    blogPostId: post._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${post.title}`,
    config: [
      {
        name: pageTitle,
        href: links.console.companyId.blog.url,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Inner testId={'company-post-details'}>
        <WpTitle>{post.title}</WpTitle>
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
