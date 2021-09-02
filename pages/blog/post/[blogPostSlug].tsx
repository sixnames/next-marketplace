import Breadcrumbs from 'components/Breadcrumbs';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import {
  CATALOGUE_OPTION_SEPARATOR,
  ROUTE_BLOG_WITH_PAGE,
  SORT_DESC,
  VIEWS_COUNTER_STEP,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import {
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_LIKES,
  COL_BLOG_POSTS,
  COL_OPTIONS,
  COL_USERS,
} from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogAttributeInterface, BlogPostInterface, OptionInterface } from 'db/uiInterfaces';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { BlogListSnippetMeta } from 'pages/blog/[...filters]';
import * as React from 'react';

interface BlogPostPageConsumerInterface {
  post: BlogPostInterface;
}

const BlogPostPageConsumer: React.FC<BlogPostPageConsumerInterface> = ({ post }) => {
  const { locale } = useLocaleContext();
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);
  const { configs } = useConfigContext();

  return (
    <div className='mb-12'>
      <Breadcrumbs
        currentPageName={`${post.title}`}
        config={[
          {
            name: blogLinkName,
            href: ROUTE_BLOG_WITH_PAGE,
          },
        ]}
      />
      <Inner lowTop>
        <div className='mb-8'>
          <BlogListSnippetMeta
            showViews={configs.showBlogPostViews}
            createdAt={post.createdAt}
            likesCount={post.likesCount}
            viewsCount={post.views}
          />
        </div>
        <PageEditor value={JSON.parse(post.content)} readOnly />
      </Inner>
    </div>
  );
};

interface BlogPostPageInterface
  extends SiteLayoutProviderInterface,
    BlogPostPageConsumerInterface {}

const BlogPostPage: React.FC<BlogPostPageInterface> = ({ post, ...props }) => {
  return (
    <SiteLayout {...props} title={`${post.title}`} description={`${post.description}`}>
      <BlogPostPageConsumer post={post} />
    </SiteLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostPageInterface>> => {
  const { query } = context;
  const { blogPostSlug } = query;
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props || !props.initialData.configs.showBlog || !blogPostSlug) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);

  const viewsStage = {
    $addFields: {
      views: { $max: `$views.${props.companySlug}.${props.sessionCity}` },
      priorities: { $max: `$priorities.${props.companySlug}.${props.sessionCity}` },
    },
  };

  const initialBlogPostsAggregation = await blogPostsCollection
    .aggregate([
      {
        $match: {
          companySlug: props.companySlug,
          slug: blogPostSlug,
        },
      },

      // author
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

      // group
      viewsStage,
      {
        $unwind: {
          path: '$selectedOptionsSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          slugArray: {
            $split: ['$selectedOptionsSlugs', CATALOGUE_OPTION_SEPARATOR],
          },
        },
      },
      {
        $addFields: {
          attributeSlug: {
            $arrayElemAt: ['$slugArray', 0],
          },
          optionSlug: {
            $arrayElemAt: ['$slugArray', 1],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          slug: { $first: '$slug' },
          companySlug: { $first: '$companySlug' },
          titleI18n: { $first: '$titleI18n' },
          descriptionI18n: { $first: '$descriptionI18n' },
          previewImage: { $first: '$previewImage' },
          authorId: { $first: '$authorId' },
          source: { $first: '$source' },
          createdAt: { $first: '$createdAt' },
          views: { $first: '$views' },
          content: { $first: '$content' },
          selectedOptionsSlugs: {
            $addToSet: '$selectedOptionsSlugs',
          },
          attributesSlugs: {
            $addToSet: '$attributeSlug',
          },
          optionsSlugs: {
            $addToSet: '$optionSlug',
          },
        },
      },

      // likes
      {
        $lookup: {
          from: COL_BLOG_LIKES,
          as: 'likes',
          let: {
            blogPostId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$blogPostId', '$$blogPostId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: '$likes',
          },
        },
      },

      // attributes
      {
        $lookup: {
          from: COL_BLOG_ATTRIBUTES,
          as: 'attributes',
          let: {
            attributesSlugs: '$attributesSlugs',
            optionsSlugs: '$optionsSlugs',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ['$slug', '$$attributesSlugs'],
                    },
                  ],
                },
              },
            },
            viewsStage,
            {
              $sort: {
                views: SORT_DESC,
                _id: SORT_DESC,
              },
            },

            // options
            {
              $lookup: {
                from: COL_OPTIONS,
                as: 'options',
                let: {
                  optionsGroupId: '$optionsGroupId',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $in: ['$slug', '$$optionsSlugs'],
                          },
                          {
                            $eq: ['$optionsGroupId', '$$optionsGroupId'],
                          },
                        ],
                      },
                      $or: [
                        {
                          parentId: {
                            $exists: false,
                          },
                        },
                        {
                          parentId: null,
                        },
                      ],
                    },
                  },
                  viewsStage,
                  {
                    $sort: {
                      views: SORT_DESC,
                      _id: SORT_DESC,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const initialPost = initialBlogPostsAggregation[0];
  if (!initialPost) {
    return {
      notFound: true,
    };
  }

  // update post counter
  const isStaff = props.sessionUser?.role?.isStaff;
  if (!isStaff) {
    await blogPostsCollection.findOneAndUpdate(
      { _id: initialPost._id },
      {
        $inc: {
          [`views.${props.companySlug}.${props.sessionCity}`]: VIEWS_COUNTER_STEP,
        },
      },
    );
  }

  const postOptions: OptionInterface[] = [];

  // cast attributes
  const attributes = (initialPost.attributes || []).reduce(
    (acc: BlogAttributeInterface[], attribute) => {
      const attributeName = getFieldStringLocale(attribute.nameI18n, props.sessionLocale);
      if (!attributeName) {
        return acc;
      }

      // cast options
      const options = (attribute.options || []).reduce((optionsAcc: OptionInterface[], option) => {
        const name = getFieldStringLocale(option.nameI18n, props.sessionLocale);
        if (!name) {
          return optionsAcc;
        }

        const translatedOption = {
          ...option,
          name,
        };

        // add option to the post
        const exist = postOptions.some(({ slug }) => slug === translatedOption.slug);
        if (!exist) {
          postOptions.push(translatedOption);
        }

        return [...optionsAcc, translatedOption];
      }, []);

      const translatedAttribute = {
        ...attribute,
        name: attributeName,
        options,
      };

      return [...acc, translatedAttribute];
    },
    [],
  );

  const post: BlogPostInterface = {
    ...initialPost,
    title: getFieldStringLocale(initialPost.titleI18n, props.sessionLocale),
    description: getFieldStringLocale(initialPost.descriptionI18n, props.sessionLocale),
    attributes,
    options: postOptions,
    likedBySessionUser: (initialPost.likes || []).some((like) => {
      return props.sessionUser && like.userId.equals(new ObjectId(props.sessionUser._id));
    }),
    author: initialPost.author
      ? {
          ...initialPost.author,
          fullName: getFullName(initialPost.author),
        }
      : null,
  };

  return {
    props: {
      ...props,
      post: castDbData(post),
    },
  };
};

export default BlogPostPage;
