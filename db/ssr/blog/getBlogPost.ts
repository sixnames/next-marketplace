import { COL_OPTIONS, COL_USERS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { BlogAttributeInterface, BlogPostInterface } from 'db/uiInterfaces';
import { DEFAULT_LOCALE, FILTER_SEPARATOR, SORT_ASC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { ObjectId } from 'mongodb';

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
  const collections = await getDbCollections();
  const blogPostsCollection = collections.blogPostsCollection();
  const blogAttributesCollection = collections.blogAttributesCollection();

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

  const filterSlugs = post.filterSlugs.reduce((acc: string[], slug) => {
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
                  $in: filterSlugs,
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
