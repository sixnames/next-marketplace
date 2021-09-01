import Breadcrumbs from 'components/Breadcrumbs';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import TagLink from 'components/Link/TagLink';
import Title from 'components/Title';
import {
  CATALOGUE_OPTION_SEPARATOR,
  PAGE_STATE_PUBLISHED,
  ROUTE_BLOG_POST,
  SORT_DESC,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import { COL_BLOG_ATTRIBUTES, COL_BLOG_POSTS, COL_OPTIONS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogAttributeInterface, BlogPostInterface, OptionInterface } from 'db/uiInterfaces';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import Head from 'next/head';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface BlogListSnippetMetaInterface {
  createdAt?: string | Date | null;
  views?: number | null;
  showViews: boolean;
}

const BlogListSnippetMeta: React.FC<BlogListSnippetMetaInterface> = ({
  showViews,
  createdAt,
  views,
}) => {
  return (
    <div className='flex items center flex-wrap gap-5 text-secondary-text mb-3'>
      <FormattedDate value={createdAt} />
      {/*views counter*/}
      {showViews ? (
        <div className='flex items-center gap-2'>
          <Icon className='w-5 h-5' name={'eye'} />
          <div>{views}</div>
        </div>
      ) : null}
    </div>
  );
};

interface BlogListSnippetTagsInterface {
  options?: OptionInterface[] | null;
  theme?: 'primary' | 'secondary';
}

const BlogListSnippetTags: React.FC<BlogListSnippetTagsInterface> = ({ options, theme }) => {
  if (!options) {
    return null;
  }
  return (
    <div className='mt-3 flex flex-wrap gap-3'>
      {options.map((option) => {
        return (
          <TagLink theme={theme} key={`${option._id}`}>
            #{option.name}
          </TagLink>
        );
      })}
    </div>
  );
};

const snippetClassName = `relative overflow-hidden rounded-md bg-secondary hover:shadow-xl transition-shadow duration-150`;

interface BlogListSnippetInterface {
  post: BlogPostInterface;
  showViews: boolean;
}

const BlogListSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  return (
    <div className={snippetClassName}>
      {/*image*/}
      <div className='relative overflow-hidden h-[200px]'>
        <img
          className='absolute h-full w-full inset-0 object-cover'
          src={post.previewImage || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`}
          alt={`${post.title}`}
          title={`${post.title}`}
        />
        <Link
          testId={`${post.title}-image-link`}
          className='block absolute z-20 inset-0 text-indent-full'
          href={`${ROUTE_BLOG_POST}/${post.slug}`}
        >
          {post.title}
        </Link>
      </div>

      <div className='px-4 py-6'>
        {/*title*/}
        <div className='font-medium text-lg mb-3'>
          <Link
            testId={`${post.title}-title-link`}
            className='block text-primary-text hover:no-underline'
            href={`${ROUTE_BLOG_POST}/${post.slug}`}
          >
            {post.title}
          </Link>
        </div>

        {/*meta*/}
        <BlogListSnippetMeta showViews={showViews} createdAt={post.createdAt} views={post.views} />

        {/*description*/}
        <div>{post.description}</div>

        {/*tags*/}
        <BlogListSnippetTags theme={'primary'} options={post.options} />
      </div>
    </div>
  );
};

const BlogListMainSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  return (
    <div className={`${snippetClassName} min-h-[300px] sm:col-span-2`}>
      <img
        className='absolute h-full w-full inset-0 object-cover'
        src={post.previewImage || `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`}
        alt={`${post.title}`}
        title={`${post.title}`}
      />

      <div className='absolute inset-0 w-full h-full flex flex-col justify-end z-10'>
        <div className='px-4 pb-6 pt-12 blog-post-image-cover'>
          {/*title*/}
          <div className='font-medium text-xl mb-3 text-white'>{post.title}</div>

          {/*meta*/}
          <BlogListSnippetMeta
            showViews={showViews}
            createdAt={post.createdAt}
            views={post.views}
          />

          {/*description*/}
          <div className='text-white'>{post.description}</div>

          {/*tags*/}
          <BlogListSnippetTags options={post.options} />
        </div>
      </div>

      <Link
        testId={`${post.title}-image-link`}
        className='block absolute z-20 inset-0 text-indent-full'
        href={`${ROUTE_BLOG_POST}/${post.slug}`}
      >
        {post.title}
      </Link>
    </div>
  );
};

interface BlogListPageConsumerInterface {
  posts: BlogPostInterface[];
  blogFilter: BlogAttributeInterface[];
  meta: string;
}

const BlogListPageConsumer: React.FC<BlogListPageConsumerInterface> = ({
  posts,
  blogFilter,
  meta,
}) => {
  const { locale } = useLocaleContext();
  const { configs } = useConfigContext();
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);
  const metaTitle = `${blogLinkName} ${meta}`;

  console.log(blogFilter);

  return (
    <React.Fragment>
      <Head>
        <title>{metaTitle}</title>
        <meta name={'description'} content={metaTitle} />
      </Head>
      <div className='mb-12'>
        <Breadcrumbs currentPageName={blogLinkName} />
        <Inner lowTop>
          <Title>{blogLinkName}</Title>
          {posts.length > 0 ? (
            <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
              {posts.map((post, index) => {
                if (index === 0) {
                  return (
                    <BlogListMainSnippet
                      post={post}
                      showViews={configs.showBlogPostViews}
                      key={`${post._id}`}
                    />
                  );
                }
                return (
                  <BlogListSnippet
                    post={post}
                    showViews={configs.showBlogPostViews}
                    key={`${post._id}`}
                  />
                );
              })}
            </div>
          ) : (
            <div className='font-medium text-lg'>Мы пока готовым для Вас интересные стати :)</div>
          )}
        </Inner>
      </div>
    </React.Fragment>
  );
};

interface BlogListPageInterface
  extends SiteLayoutProviderInterface,
    BlogListPageConsumerInterface {}

const BlogListPage: React.FC<BlogListPageInterface> = ({ posts, meta, blogFilter, ...props }) => {
  return (
    <SiteLayout {...props}>
      <BlogListPageConsumer blogFilter={blogFilter} posts={posts} meta={meta} />
    </SiteLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BlogListPageInterface>> => {
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props || !props.initialData.configs.showBlog) {
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
          state: PAGE_STATE_PUBLISHED,
        },
      },
      viewsStage,
      {
        $sort: {
          createdAt: SORT_DESC,
        },
      },
      {
        $project: {
          content: false,
        },
      },
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

  const blogOptions: OptionInterface[] = [];
  const blogAttributes: BlogAttributeInterface[] = [];

  const posts: BlogPostInterface[] = initialBlogPostsAggregation.map((post) => {
    const postOptions: OptionInterface[] = [];

    // cast attributes
    const attributes = (post.attributes || []).reduce(
      (acc: BlogAttributeInterface[], attribute) => {
        const attributeName = getFieldStringLocale(attribute.nameI18n, props.sessionLocale);
        if (!attributeName) {
          return acc;
        }

        // cast options
        const options = (attribute.options || []).reduce(
          (optionsAcc: OptionInterface[], option) => {
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

            // add option to the total list
            const existInAllOptions = blogOptions.some(
              ({ slug }) => slug === translatedOption.slug,
            );
            if (!existInAllOptions) {
              blogOptions.push(translatedOption);
            }

            return [...optionsAcc, translatedOption];
          },
          [],
        );

        const translatedAttribute = {
          ...attribute,
          name: attributeName,
          options,
        };

        // add attribute to the total list
        const exist = blogAttributes.some(({ slug }) => slug === attribute.slug);
        if (!exist) {
          blogAttributes.push({
            ...translatedAttribute,
            options: [],
          });
        }

        return [...acc, translatedAttribute];
      },
      [],
    );

    return {
      ...post,
      title: getFieldStringLocale(post.titleI18n, props.sessionLocale),
      description: getFieldStringLocale(post.descriptionI18n, props.sessionLocale),
      attributes,
      options: postOptions,
    };
  });

  // meta
  const metaList = blogOptions.reduce((acc: string[], { name }) => {
    return [...acc, `${name}`];
  }, []);

  // filter
  const blogFilter = blogAttributes.map((attribute) => {
    const options = blogOptions.filter((option) => {
      return option.optionsGroupId.equals(attribute.optionsGroupId);
    });
    return {
      ...attribute,
      options,
    };
  });

  return {
    props: {
      ...props,
      posts: castDbData(posts),
      blogFilter: castDbData(blogFilter),
      meta: metaList.join(', '),
    },
  };
};

export default BlogListPage;
