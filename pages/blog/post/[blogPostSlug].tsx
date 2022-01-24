import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import FixedButtons from '../../../components/button/FixedButtons';
import WpButton from '../../../components/button/WpButton';
import FormattedDate from '../../../components/FormattedDate';
import Inner from '../../../components/Inner';
import PageEditor from '../../../components/PageEditor';
import WpBreadcrumbs from '../../../components/WpBreadcrumbs';
import WpIcon from '../../../components/WpIcon';
import WpTooltip from '../../../components/WpTooltip';
import {
  FILTER_SEPARATOR,
  REQUEST_METHOD_POST,
  ROUTE_BLOG,
  SORT_DESC,
} from '../../../config/common';
import { getConstantTranslation } from '../../../config/constantTranslations';
import { useAppContext } from '../../../context/appContext';
import { useConfigContext } from '../../../context/configContext';
import { useLocaleContext } from '../../../context/localeContext';
import { useSiteUserContext } from '../../../context/siteUserContext';
import {
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_LIKES,
  COL_BLOG_POSTS,
  COL_OPTIONS,
  COL_USERS,
} from '../../../db/collectionNames';
import { UpdateBlogPostCountersInputInterface } from '../../../db/dao/blog/updateBlogPostCounters';
import { getDatabase } from '../../../db/mongodb';
import {
  BlogAttributeInterface,
  BlogPostInterface,
  OptionInterface,
} from '../../../db/uiInterfaces';
import { useCreateBlogPostLike } from '../../../hooks/mutations/useBlogMutations';
import SiteLayout, { SiteLayoutProviderInterface } from '../../../layout/SiteLayout';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getConsoleBlogLinks } from '../../../lib/linkUtils';
import { getFullName } from '../../../lib/nameUtils';
import { noNaN } from '../../../lib/numbers';
import { castDbData, getSiteInitialData } from '../../../lib/ssrUtils';
import { BlogListSnippetTags } from '../[...filters]';

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
          <WpIcon className='w-5 h-5' name={'eye'} />
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
          <WpIcon className='w-4 h-4' name={'like'} />
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
  const sessionUser = useSiteUserContext();
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);
  const [isLikeAllowed, setIsLikeAllowed] = React.useState<boolean>(false);
  const links = getConsoleBlogLinks({
    basePath: sessionUser?.editLinkBasePath,
    blogPostId: post._id,
  });
  const showEditButton = sessionUser?.me.role?.cmsNavigation?.some(({ path }) => {
    return path.includes(links.mainPath);
  });

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
    <div className='mb-12 relative'>
      <WpBreadcrumbs
        currentPageName={`${post.title}`}
        config={[
          {
            name: blogLinkName,
            href: ROUTE_BLOG,
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

        {showEditButton ? (
          <FixedButtons>
            <WpButton
              size={'small'}
              frameClassName={'w-auto'}
              onClick={() => {
                window.open(links.root, '_blank');
              }}
            >
              Редактировать
            </WpButton>
          </FixedButtons>
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogPostPageInterface>> => {
  const { query } = context;
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props || !props.initialData.configs.showBlog || !query?.blogPostSlug) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);

  const viewsStage = {
    $addFields: {
      views: { $max: `$views.${props.companySlug}.${props.citySlug}` },
    },
  };

  const initialBlogPostsAggregation = await blogPostsCollection
    .aggregate<BlogPostInterface>([
      {
        $match: {
          companySlug: props.companySlug,
          slug: query.blogPostSlug,
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
          path: '$filterSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          slugArray: {
            $split: ['$filterSlugs', FILTER_SEPARATOR],
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
          filterSlugs: {
            $addToSet: '$filterSlugs',
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
      showForIndex: true,
    },
  };
};

export default BlogPostPage;
