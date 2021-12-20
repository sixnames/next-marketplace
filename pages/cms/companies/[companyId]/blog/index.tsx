import { ObjectId } from 'mongodb';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import * as React from 'react';
import BlogPostsList from '../../../../../components/blog/BlogPostsList';
import Inner from '../../../../../components/Inner';
import { ROUTE_CMS } from '../../../../../config/common';
import { COL_COMPANIES } from '../../../../../db/collectionNames';
import { getBlogPostsList } from '../../../../../db/dao/blog/getBlogPostsList';
import { getDatabase } from '../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  BlogPostInterface,
  CompanyInterface,
} from '../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../layout/cms/CmsCompanyLayout';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
  pageCompany: CompanyInterface;
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({
  posts,
  pageCompany,
}) => {
  const basePath = `${ROUTE_CMS}/companies/${pageCompany?._id}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: pageTitle,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${pageCompany?.name}`,
        href: `${ROUTE_CMS}/companies/${pageCompany?._id}`,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-posts-list'}>
        <BlogPostsList posts={posts} basePath={basePath} companySlug={`${pageCompany?.slug}`} />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface BlogPostsListPageInterface
  extends GetAppInitialDataPropsInterface,
    BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <BlogPostsListConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostsListPageInterface>> => {
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

  const posts = await getBlogPostsList({
    locale: props.sessionLocale,
    companySlug: companyResult.slug,
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
      pageCompany: castDbData(companyResult),
    },
  };
};

export default BlogPostsListPage;
