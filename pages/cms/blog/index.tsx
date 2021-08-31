import BlogPostsList from 'components/blog/BlogPostsList';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS, SORT_DESC } from 'config/common';
import { COL_BLOG_POSTS, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogPostInterface } from 'db/uiInterfaces';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface BlogPostsListConsumerInterface {
  posts: BlogPostInterface[];
}

const pageTitle = 'Блог';

const BlogPostsListConsumer: React.FC<BlogPostsListConsumerInterface> = ({ posts }) => {
  return (
    <BlogPostsList
      posts={posts}
      pageTitle={pageTitle}
      basePath={ROUTE_CMS}
      companySlug={DEFAULT_COMPANY_SLUG}
    />
  );
};

interface BlogPostsListPageInterface extends PagePropsInterface, BlogPostsListConsumerInterface {}

const BlogPostsListPage: React.FC<BlogPostsListPageInterface> = ({ posts, pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <BlogPostsListConsumer posts={posts} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostsListPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);

  const initialBlogPostsAggregation = await blogPostsCollection
    .aggregate([
      {
        $match: {
          companySlug: DEFAULT_COMPANY_SLUG,
        },
      },
      {
        $sort: {
          updatedAt: SORT_DESC,
          _id: SORT_DESC,
        },
      },
      {
        $lookup: {
          as: 'author',
          from: COL_USERS,
          let: {
            authorId: '$authorId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$authorId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          author: {
            $arrayElemAt: ['$author', 0],
          },
        },
      },
    ])
    .toArray();

  const posts = initialBlogPostsAggregation.map((post) => {
    return {
      ...post,
      title: getFieldStringLocale(post.titleI18n, props.sessionLocale),
      author: post.author
        ? {
            ...post.author,
            fullName: getFullName(post.author),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
    },
  };
};

export default BlogPostsListPage;
