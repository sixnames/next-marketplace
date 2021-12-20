import { ObjectId } from 'mongodb';
import { DEFAULT_LOCALE, FILTER_SEPARATOR, SORT_ASC } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getFullName } from '../../../lib/nameUtils';
import { COL_BLOG_ATTRIBUTES, COL_BLOG_POSTS, COL_OPTIONS, COL_USERS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { BlogAttributeInterface, BlogPostInterface } from '../../uiInterfaces';

interface GetBlogPostInterface {
  locale: string;
  blogPostId: string;
}

interface GetBlogPostPayloadInterface {
  post: BlogPostInterface;
  attributes: BlogAttributeInterface[];
}

export const getBlogPost = async ({
  blogPostId,
  locale,
}: GetBlogPostInterface): Promise<GetBlogPostPayloadInterface | null> => {
  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);
  const blogAttributesCollection = db.collection<BlogAttributeInterface>(COL_BLOG_ATTRIBUTES);

  const initialBlogPostAggregation = await blogPostsCollection
    .aggregate<BlogPostInterface>([
      {
        $match: {
          _id: new ObjectId(`${blogPostId}`),
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

  const initialPost = initialBlogPostAggregation[0];
  if (!initialPost) {
    return null;
  }

  const post: BlogPostInterface = {
    ...initialPost,
    title: getFieldStringLocale(initialPost.titleI18n, locale),
    author: initialPost.author
      ? {
          ...initialPost.author,
          fullName: getFullName(initialPost.author),
        }
      : null,
  };

  const selectedOptionsSlugs = post.selectedOptionsSlugs.reduce((acc: string[], slug) => {
    const slugParts = slug.split(FILTER_SEPARATOR);
    const optionSlug = slugParts[1];
    if (!optionSlug) {
      return acc;
    }
    return [...acc, optionSlug];
  }, []);

  const initialBlogAttributesAggregation = await blogAttributesCollection
    .aggregate<BlogAttributeInterface>([
      {
        $sort: {
          [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
        },
      },
      {
        $lookup: {
          as: 'options',
          from: COL_OPTIONS,
          let: {
            optionsGroupId: '$optionsGroupId',
          },
          pipeline: [
            {
              $match: {
                slug: {
                  $in: selectedOptionsSlugs,
                },
                $expr: {
                  $eq: ['$optionsGroupId', '$$optionsGroupId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const attributes = initialBlogAttributesAggregation.map((attribute) => {
    const options = attribute.options
      ? attribute.options.map((option) => {
          return {
            ...option,
            name: getFieldStringLocale(option.nameI18n, locale),
          };
        })
      : null;
    const optionNames = (options || [])
      .filter((option) => {
        return option.slug;
      })
      .map(({ name }) => `${name}`);

    return {
      ...attribute,
      name: getFieldStringLocale(attribute.nameI18n, locale),
      options,
      readableValue: optionNames.join(', '),
    };
  });

  return {
    post,
    attributes,
  };
};
