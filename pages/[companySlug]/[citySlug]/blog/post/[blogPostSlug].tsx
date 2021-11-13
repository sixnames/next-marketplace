import Breadcrumbs from 'components/Breadcrumbs';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import WpTooltip from 'components/WpTooltip';
import {
  FILTER_SEPARATOR,
  REQUEST_METHOD_POST,
  ROUTE_BLOG_WITH_PAGE,
  SORT_DESC,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import { useSiteContext } from 'context/siteContext';
import { useSiteUserContext } from 'context/userSiteUserContext';
import {
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_LIKES,
  COL_BLOG_POSTS,
  COL_OPTIONS,
  COL_USERS,
} from 'db/collectionNames';
import { UpdateBlogPostCountersInputInterface } from 'db/dao/blog/updateBlogPostCounters';
import { getDatabase } from 'db/mongodb';
import { BlogAttributeInterface, BlogPostInterface, OptionInterface } from 'db/uiInterfaces';
import { useCreateBlogPostLike } from 'hooks/mutations/useBlogMutations';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getIsrSiteInitialData, IsrContextInterface } from 'lib/isrUtils';
import { getFullName } from 'lib/nameUtils';
import { noNaN } from 'lib/numbers';
import { castDbData } from 'lib/ssrUtils';
import { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { BlogListSnippetTags } from 'pages/[companySlug]/[citySlug]/blog/[...filters]';
import * as React from 'react';

interface BlogListSnippetMetaInterface {
  createdAt?: string | Date | null;
  viewsCount?: number | null;
  likesCount?: number | null;
  isLikeAllowed?: boolean | null;
  blogPostId: string;
}

const BlogPostMeta: React.FC<BlogListSnippetMetaInterface> = ({
  blogPostId,
  createdAt,
  viewsCount,
  likesCount,
  isLikeAllowed,
}) => {
  const [createBlogPostLike] = useCreateBlogPostLike();
  const { configs } = useConfigContext();
  const sessionUser = useSiteUserContext();

  return (
    <div className='flex items center flex-wrap gap-5 text-secondary-text mb-3'>
      <FormattedDate value={createdAt} />
      {/*views counter*/}
      {configs.showBlogPostViews ? (
        <div className='flex items-center gap-2'>
          <Icon className='w-5 h-5' name={'eye'} />
          <div>{viewsCount}</div>
        </div>
      ) : null}

      {/*likes counter*/}
      <WpTooltip title={sessionUser?.me ? '' : 'Вы должны быть авторизованны для данного действия'}>
        <div
          className={`flex items-center gap-2 ${
            isLikeAllowed ? 'cursor-pointer transition-all duration-150 hover:text-theme' : ''
          }`}
          onClick={() => {
            if (isLikeAllowed) {
              createBlogPostLike({ blogPostId }).catch(console.log);
            }
          }}
        >
          <Icon className='w-4 h-4' name={'like'} />
          <div>{noNaN(likesCount)}</div>
        </div>
      </WpTooltip>
    </div>
  );
};

interface BlogPostPageConsumerInterface {
  post: BlogPostInterface;
}

const BlogPostPageConsumer: React.FC<BlogPostPageConsumerInterface> = ({ post }) => {
  const { sessionCity, companySlug } = useAppContext();
  const { locale } = useLocaleContext();
  const { urlPrefix } = useSiteContext();
  const sessionUser = useSiteUserContext();
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);
  const [isLikeAllowed, setIsLikeAllowed] = React.useState<boolean>(false);

  React.useCallback(() => {
    const likedBySessionUser = (post.likes || []).some((like) => {
      return sessionUser && like.userId === sessionUser.me._id;
    });
    const isLikeAllowed = Boolean(sessionUser && !likedBySessionUser);

    setIsLikeAllowed(isLikeAllowed);
  }, [post.likes, sessionUser]);

  React.useEffect(() => {
    const input: UpdateBlogPostCountersInputInterface = {
      blogPostId: `${post._id}`,
      sessionCity,
      companySlug,
    };
    fetch(`/api/blog/update-post-counters`, {
      body: JSON.stringify(input),
      method: REQUEST_METHOD_POST,
    }).catch(console.log);
  }, [companySlug, post._id, sessionCity]);

  return (
    <div className='mb-12'>
      <Breadcrumbs
        urlPrefix={urlPrefix}
        currentPageName={`${post.title}`}
        config={[
          {
            name: blogLinkName,
            href: ROUTE_BLOG_WITH_PAGE,
          },
        ]}
      />
      <Inner lowTop>
        <div className='mb-3'>
          <BlogPostMeta
            blogPostId={`${post._id}`}
            createdAt={post.createdAt}
            likesCount={post.likesCount}
            viewsCount={post.views}
            isLikeAllowed={isLikeAllowed}
          />
        </div>
        <div className='mb-8'>
          <BlogListSnippetTags attributes={post.attributes} />
        </div>
        <PageEditor value={JSON.parse(post.content)} readOnly />

        {post.source ? (
          <div className='mt-8 text-secondary-text'>Источник {post.source}</div>
        ) : null}
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

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths: any[] = [];
  return {
    paths,
    fallback: 'blocking',
  };
}

export const getStaticProps = async (
  context: IsrContextInterface,
): Promise<GetStaticPropsResult<BlogPostPageInterface>> => {
  const { params } = context;
  const { props } = await getIsrSiteInitialData({
    context,
  });

  if (!props || !props.initialData.configs.showBlog || !params?.blogPostSlug) {
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
    .aggregate<BlogPostInterface>([
      {
        $match: {
          companySlug: props.companySlug,
          slug: params.blogPostSlug,
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
            $split: ['$selectedOptionsSlugs', FILTER_SEPARATOR],
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
  // Session user
  // TODO update blog counter api route
  /*const sessionUser = await getPageSessionUser({
    context,
    locale: props.sessionLocale,
  });
  const isStaff = sessionUser?.me.role?.isStaff;
  if (!isStaff) {
  
  }*/

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
