import { ObjectId } from 'mongodb';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import * as React from 'react';
import BlogPostsDetails from 'components/blog/BlogPostsDetails';
import Inner from 'components/Inner';
import { COL_COMPANIES } from 'db/collectionNames';
import { getBlogPost } from 'db/dao/blog/getBlogPost';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  BlogAttributeInterface,
  BlogPostInterface,
  CompanyInterface,
} from 'db/uiInterfaces';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

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
  const links = getCmsCompanyLinks({
    companyId: pageCompany?._id,
    blogPostId: post._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${post.title}`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.root,
      },
      {
        name: pageTitle,
        href: links.blog.root,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Inner testId={'company-post-details'}>
        <BlogPostsDetails attributes={attributes} post={post} />
      </Inner>
    </CmsCompanyLayout>
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
  if (!props || !context.query.companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${context.query.companyId}`),
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
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
      pageCompany: castDbData(companyResult),
    },
  };
};

export default BlogPostPage;
