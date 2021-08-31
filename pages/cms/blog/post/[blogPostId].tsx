import BlogPostsDetails from 'components/blog/BlogPostsDetails';
import { CATALOGUE_OPTION_SEPARATOR, DEFAULT_LOCALE, ROUTE_CMS, SORT_ASC } from 'config/common';
import { COL_BLOG_ATTRIBUTES, COL_BLOG_POSTS, COL_OPTIONS, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogAttributeInterface, BlogPostInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
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

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);
  const blogAttributesCollection = db.collection<BlogAttributeInterface>(COL_BLOG_ATTRIBUTES);

  const initialBlogPostAggregation = await blogPostsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${context.query.blogPostId}`),
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
    return {
      notFound: true,
    };
  }

  const post: BlogPostInterface = {
    ...initialPost,
    title: getFieldStringLocale(initialPost.titleI18n, props.sessionLocale),
    author: initialPost.author
      ? {
          ...initialPost.author,
          fullName: getFullName(initialPost.author),
        }
      : null,
  };

  const selectedOptionsSlugs = post.selectedOptionsSlugs.reduce((acc: string[], slug) => {
    const slugParts = slug.split(CATALOGUE_OPTION_SEPARATOR);
    const optionSlug = slugParts[1];
    if (!optionSlug) {
      return acc;
    }
    return [...acc, optionSlug];
  }, []);

  const initialBlogAttributesAggregation = await blogAttributesCollection
    .aggregate([
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
            name: getFieldStringLocale(option.nameI18n, props.sessionLocale),
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
      name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
      options,
      readableValue: optionNames.join(', '),
    };
  });

  return {
    props: {
      ...props,
      post: castDbData(post),
      attributes: castDbData(attributes),
    },
  };
};

export default BlogPostPage;
