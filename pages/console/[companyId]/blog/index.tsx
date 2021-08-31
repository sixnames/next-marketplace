import BlogPostsList from 'components/blog/BlogPostsList';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getBlogPostsList } from 'db/dao/blog/getBlogPostsList';
import { getDatabase } from 'db/mongodb';
import { BlogPostInterface, CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
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
  const basePath = `${ROUTE_CONSOLE}/${currentCompany?._id}`;

  return (
    <AppContentWrapper>
      <Inner testId={'company-posts-list'}>
        <Title>{pageTitle}</Title>
        <BlogPostsList posts={posts} basePath={basePath} companySlug={`${currentCompany?.slug}`} />
      </Inner>
    </AppContentWrapper>
  );
};

interface BlogPostsListPageInterface extends PagePropsInterface, BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({
  posts,
  pageUrls,
  currentCompany,
}) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} title={pageTitle} company={currentCompany}>
      <BlogPostsListConsumer posts={posts} currentCompany={currentCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostsListPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  console.log(props);
  if (!props || !props.currentCompany || !context.query.companyId) {
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
    companySlug: `${props.currentCompany?.slug}`,
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
      currentCompany: props.currentCompany,
    },
  };
};

export default BlogPostsListPage;
