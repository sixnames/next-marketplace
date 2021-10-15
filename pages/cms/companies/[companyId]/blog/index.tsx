import BlogPostsList from 'components/blog/BlogPostsList';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getBlogPostsList } from 'db/dao/blog/getBlogPostsList';
import { getDatabase } from 'db/mongodb';
import { BlogPostInterface, CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import CmsLayout from 'layout/cms/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
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
  const basePath = `${ROUTE_CMS}/companies/${currentCompany?._id}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: pageTitle,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: `${ROUTE_CMS}/companies/${currentCompany?._id}`,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={currentCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-posts-list'}>
        <BlogPostsList posts={posts} basePath={basePath} companySlug={`${currentCompany?.slug}`} />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface BlogPostsListPageInterface extends PagePropsInterface, BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({
  posts,
  pageUrls,
  currentCompany,
}) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <BlogPostsListConsumer posts={posts} currentCompany={currentCompany} />
    </CmsLayout>
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
      currentCompany: castDbData(companyResult),
    },
  };
};

export default BlogPostsListPage;
