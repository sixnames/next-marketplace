import { SORT_DESC } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getFullName } from '../../../lib/nameUtils';
import { COL_BLOG_POSTS, COL_USERS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { BlogPostInterface } from '../../uiInterfaces';

export interface GetBlogPostsListInterface {
  companySlug: string;
  locale: string;
}

export const getBlogPostsList = async ({
  companySlug,
  locale,
}: GetBlogPostsListInterface): Promise<BlogPostInterface[]> => {
  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);

  const initialBlogPostsAggregation = await blogPostsCollection
    .aggregate<BlogPostInterface>([
      {
        $match: {
          companySlug,
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

  const posts: BlogPostInterface[] = initialBlogPostsAggregation.map((post) => {
    return {
      ...post,
      title: getFieldStringLocale(post.titleI18n, locale),
      author: post.author
        ? {
            ...post.author,
            fullName: getFullName(post.author),
          }
        : null,
    };
  });

  return posts;
};
