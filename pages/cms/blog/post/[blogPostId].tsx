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
} from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import * as React from 'react';

interface BlogPostConsumerInterface {
  post: BlogPostInterface;
  attributes: BlogAttributeInterface[];
}

const pageTitle = 'Блог';

const BlogPostConsumer: React.FC<BlogPostConsumerInterface> = ({ post, attributes }) => {
  const links = getProjectLinks({
    blogPostId: post._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${post.title}`,
    config: [
      {
        name: 'Блог',
        href: links.cms.blog.url,
      },
    ],
  };

  return (
    <AppContentWrapper testId={'post-details'} breadcrumbs={breadcrumbs}>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{post.title}</WpTitle>
      </Inner>

      <Inner>
        <BlogPostsDetails attributes={attributes} post={post} />
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostPageInterface
  extends GetAppInitialDataPropsInterface,
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
  const { props } = await getAppInitialData({ context });
  if (!props || !context.query.blogPostId) {
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
    },
  };
};

export default BlogPostPage;
