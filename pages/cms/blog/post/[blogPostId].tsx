import BlogPostsDetails from 'components/blog/BlogPostsDetails';
import { ROUTE_CMS } from 'config/common';
import { getBlogPost } from 'db/dao/blog/getBlogPost';
import { BlogAttributeInterface, BlogPostInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface BlogPostConsumerInterface {
  post: BlogPostInterface;
  attributes: BlogAttributeInterface[];
}

const pageTitle = 'Блог';

const BlogPostConsumer: React.FC<BlogPostConsumerInterface> = ({ post, attributes }) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${post.title}`,
    config: [
      {
        name: 'Блог',
        href: `${ROUTE_CMS}/blog`,
      },
    ],
  };

  return <BlogPostsDetails attributes={attributes} post={post} breadcrumbs={breadcrumbs} />;
};

interface BlogPostPageInterface extends PagePropsInterface, BlogPostConsumerInterface {}

const BlogPostPage: React.FC<BlogPostPageInterface> = ({ post, pageUrls, attributes }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <BlogPostConsumer post={post} attributes={attributes} />
    </CmsLayout>
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
