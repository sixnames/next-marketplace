import Breadcrumbs from 'components/Breadcrumbs';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import FilterLink from 'components/Link/FilterLink';
import Link from 'components/Link/Link';
import TagLink from 'components/Link/TagLink';
import Title from 'components/Title';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  FILTER_SEPARATOR,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_PAGE,
  PAGE_STATE_PUBLISHED,
  ROUTE_BLOG_POST,
  ROUTE_BLOG_WITH_PAGE,
  SORT_DESC,
  ROUTE_BLOG,
  IMAGE_FALLBACK,
  REQUEST_METHOD_POST,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import { useSiteContext } from 'context/siteContext';
import {
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_LIKES,
  COL_BLOG_POSTS,
  COL_OPTIONS,
} from 'db/collectionNames';
import { UpdateBlogAttributeCountersInputInterface } from 'db/dao/blog/updateBlogAttributeCounters';
import { AttributeViewVariantModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  BlogAttributeInterface,
  BlogPostInterface,
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
  OptionInterface,
} from 'db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, castCatalogueParamToObject } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getIsrSiteInitialData, IsrContextInterface } from 'lib/isrUtils';
import { noNaN } from 'lib/numbers';
import { castDbData } from 'lib/ssrUtils';
import Head from 'next/head';
import { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';

interface BlogListSnippetMetaInterface {
  createdAt?: string | Date | null;
  viewsCount?: number | null;
  likesCount?: number | null;
  showViews: boolean;
  isLight?: boolean;
}

const BlogListSnippetMeta: React.FC<BlogListSnippetMetaInterface> = ({
  showViews,
  createdAt,
  viewsCount,
  likesCount,
  isLight,
}) => {
  return (
    <div
      className={`flex items center flex-wrap gap-5 mb-3 ${
        isLight ? 'text-white' : 'text-secondary-text'
      }`}
    >
      <FormattedDate value={createdAt} />
      {/*views counter*/}
      {showViews ? (
        <div className='flex items-center gap-2'>
          <Icon className='w-5 h-5' name={'eye'} />
          <div>{viewsCount}</div>
        </div>
      ) : null}

      {/*likes counter*/}
      {likesCount ? (
        <div className='flex items-center gap-2'>
          <Icon className='w-4 h-4' name={'like'} />
          <div>{likesCount}</div>
        </div>
      ) : null}
    </div>
  );
};

interface BlogListSnippetTagsInterface {
  attributes?: BlogAttributeInterface[] | null;
  theme?: 'primary' | 'secondary';
}

export const BlogListSnippetTags: React.FC<BlogListSnippetTagsInterface> = ({
  attributes,
  theme,
}) => {
  const { urlPrefix } = useSiteContext();
  if (!attributes) {
    return null;
  }
  return (
    <div className='mt-3 flex flex-wrap gap-3'>
      {attributes.map((attribute) => {
        if (!attribute.options || attribute.options.length < 1) {
          return null;
        }
        return (
          <React.Fragment key={`${attribute._id}`}>
            {attribute.options.map((option) => {
              return (
                <TagLink
                  size={'small'}
                  href={`${urlPrefix}${ROUTE_BLOG}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                  theme={theme}
                  key={`${option._id}`}
                >
                  #{option.name}
                </TagLink>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const snippetClassName = `group relative overflow-hidden rounded-md bg-secondary hover:shadow-2xl transition-shadow duration-150`;

interface BlogListSnippetInterface {
  post: BlogPostInterface;
  showViews: boolean;
}

const BlogListSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  const { urlPrefix } = useSiteContext();
  return (
    <div className={`${snippetClassName} flex flex-col`}>
      {/*image*/}
      <div className='relative flex-shrink-0 overflow-hidden h-[200px] group-hover:opacity-50 transition-opacity duration-150'>
        <img
          className='absolute h-full w-full inset-0 object-cover'
          src={post.previewImage || IMAGE_FALLBACK}
          alt={`${post.title}`}
          title={`${post.title}`}
        />
        <Link
          testId={`${post.title}-image-link`}
          className='block absolute z-20 inset-0 text-indent-full'
          href={`${urlPrefix}${ROUTE_BLOG_POST}/${post.slug}`}
        >
          {post.title}
        </Link>
      </div>

      <div className='px-4 py-6 flex flex-col flex-grow-1 h-full'>
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
        <BlogListSnippetMeta
          showViews={showViews}
          createdAt={post.createdAt}
          viewsCount={post.views}
          likesCount={post.likesCount}
        />

        {/*description*/}
        <div>{post.description}</div>

        {/*tags*/}
        <div className='mt-auto'>
          <BlogListSnippetTags theme={'primary'} attributes={post.attributes} />
        </div>
      </div>
    </div>
  );
};

const BlogListMainSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  const { urlPrefix } = useSiteContext();
  return (
    <div className={`${snippetClassName} min-h-[300px] sm:col-span-2`}>
      <img
        className='absolute h-full w-full inset-0 object-cover'
        src={post.previewImage || IMAGE_FALLBACK}
        alt={`${post.title}`}
        title={`${post.title}`}
      />

      <div className='absolute inset-0 w-full h-full flex flex-col justify-end z-10'>
        <div className='px-4 pb-6 pt-12 blog-post-image-cover'>
          {/*title*/}
          <div className='font-medium text-xl mb-3 text-white'>{post.title}</div>

          {/*meta*/}
          <BlogListSnippetMeta
            isLight
            showViews={showViews}
            createdAt={post.createdAt}
            viewsCount={post.views}
            likesCount={post.likesCount}
          />

          {/*description*/}
          <div className='text-white'>{post.description}</div>

          {/*tags*/}
          <BlogListSnippetTags attributes={post.attributes} />
        </div>
      </div>

      <Link
        testId={`${post.title}-image-link`}
        className='block absolute z-20 inset-0 text-indent-full'
        href={`${urlPrefix}${ROUTE_BLOG_POST}/${post.slug}`}
      >
        {post.title}
      </Link>
    </div>
  );
};

const BlogListTopSnippet: React.FC<BlogListSnippetInterface> = ({ post, showViews }) => {
  const { urlPrefix } = useSiteContext();

  return (
    <div className='py-4'>
      {/*title*/}
      <div className='font-medium text-lg mb-3'>
        <Link
          testId={`${post.title}-title-link`}
          className='block text-primary-text hover:no-underline'
          href={`${urlPrefix}${ROUTE_BLOG_POST}/${post.slug}`}
        >
          {post.title}
        </Link>
      </div>

      <div className='mt-3'>
        {/*meta*/}
        <BlogListSnippetMeta
          showViews={showViews}
          createdAt={post.createdAt}
          viewsCount={post.views}
          likesCount={post.likesCount}
        />
      </div>
    </div>
  );
};

interface BlogFilterAttributeInterface {
  attribute: CatalogueFilterAttributeInterface;
  attributeIndex: number;
}

const BlogFilterAttribute: React.FC<BlogFilterAttributeInterface> = ({
  attribute,
  attributeIndex,
}) => {
  const { urlPrefix } = useSiteContext();
  const { name, clearSlug, options, isSelected } = attribute;

  return (
    <div className='mb-12'>
      <div className='flex items-baseline justify-between mb-4'>
        <span className='text-lg font-bold'>{name}</span>
        {isSelected ? (
          <Link href={`${urlPrefix}${clearSlug}`} className='font-medium text-theme'>
            Очистить
          </Link>
        ) : null}
      </div>

      <div className='flex flex-wrap gap-2'>
        {options.map((option, optionIndex) => {
          const testId = `catalogue-option-${attributeIndex}-${optionIndex}`;
          return (
            <FilterLink
              urlPrefix={urlPrefix}
              size={'small'}
              option={option}
              key={option.slug}
              testId={testId}
            />
          );
        })}
      </div>
    </div>
  );
};

interface BlogFilterInterface {
  blogFilter: CatalogueFilterAttributeInterface[];
  // isFilterVisible: boolean;
}

const BlogFilter: React.FC<BlogFilterInterface> = ({ blogFilter }) => {
  /*if (!isFilterVisible) {
    return null;
  }*/
  return (
    <React.Fragment>
      {blogFilter.map((attribute, index) => {
        return (
          <BlogFilterAttribute
            attribute={attribute}
            attributeIndex={index}
            key={`${attribute._id}`}
          />
        );
      })}
    </React.Fragment>
  );
};

interface BlogListPageConsumerInterface extends BlogFilterInterface {
  posts: BlogPostInterface[];
  topPosts: BlogPostInterface[];
  meta: string;
}

const BlogListPageConsumer: React.FC<BlogListPageConsumerInterface> = ({
  posts,
  topPosts,
  blogFilter,
  meta,
  // isFilterVisible,
}) => {
  const { query } = useRouter();
  const { sessionCity, companySlug } = useAppContext();
  const { locale } = useLocaleContext();
  const { configs } = useConfigContext();
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);
  const metaTitle = `${blogLinkName} ${configs.siteName} на темы ${meta}`;

  React.useEffect(() => {
    const input: UpdateBlogAttributeCountersInputInterface = {
      filters: alwaysArray(query.filters),
      sessionCity,
      companySlug,
    };
    fetch(`/api/blog/update-attribute-counters`, {
      body: JSON.stringify(input),
      method: REQUEST_METHOD_POST,
    }).catch(console.log);
  }, [companySlug, query.filters, sessionCity]);

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
            <div className={`grid lg:grid-cols-4 gap-6`}>
              <div className={`grid gap-6 sm:grid-cols-2 md:grid-cols-3 col-span-3`}>
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

              <div className='relative col-span-3 lg:col-span-1 flex items-end'>
                <div className='sticky bottom-12'>
                  <BlogFilter blogFilter={blogFilter} />

                  {/*top posts*/}
                  <div className='border border-border-100 rounded-md py-6 px-4'>
                    <div className='text-lg font-bold mb-4'>Самые читаемые</div>

                    {topPosts.length > 0 ? (
                      <div className='divide-y-2 divide-border-100'>
                        {topPosts.map((post) => {
                          return (
                            <BlogListTopSnippet
                              showViews={configs.showBlogPostViews}
                              post={post}
                              key={`${post._id}`}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='font-medium text-lg'>Мы пока готовим для Вас интересные статьи :)</div>
          )}
        </Inner>
      </div>
    </React.Fragment>
  );
};

interface BlogListPageInterface
  extends SiteLayoutProviderInterface,
    BlogListPageConsumerInterface {}

const BlogListPage: React.FC<BlogListPageInterface> = ({
  posts,
  meta,
  blogFilter,
  topPosts,
  ...props
}) => {
  return (
    <SiteLayout {...props}>
      <BlogListPageConsumer topPosts={topPosts} blogFilter={blogFilter} posts={posts} meta={meta} />
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
): Promise<GetStaticPropsResult<BlogListPageInterface>> => {
  const { props } = await getIsrSiteInitialData({
    context,
  });

  if (!props || !props.initialData.configs.showBlog) {
    return {
      notFound: true,
    };
  }

  const filters = alwaysArray(context.params?.filters);

  // Cast selected filters
  const { realFilterOptions, noFiltersSelected } = castCatalogueFilters({
    filters,
    initialPage: DEFAULT_PAGE,
    initialLimit: CATALOGUE_PRODUCTS_LIMIT,
  });

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);
  const basePath = ROUTE_BLOG_WITH_PAGE;

  const viewsStage = {
    $addFields: {
      views: { $max: `$views.${props.companySlug}.${props.sessionCity}` },
      priorities: { $max: `$priorities.${props.companySlug}.${props.sessionCity}` },
    },
  };

  const filtersStage = noFiltersSelected
    ? {}
    : {
        selectedOptionsSlugs: {
          $all: realFilterOptions,
        },
      };

  const initialBlogPostsAggregation = await blogPostsCollection
    .aggregate<BlogPostInterface>([
      {
        $match: {
          companySlug: props.companySlug,
          state: PAGE_STATE_PUBLISHED,
          ...filtersStage,
        },
      },
      viewsStage,
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
      {
        $sort: {
          createdAt: SORT_DESC,
          _id: SORT_DESC,
        },
      },

      // likes
      {
        $lookup: {
          from: COL_BLOG_LIKES,
          as: 'likesCount',
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
            $size: '$likesCount',
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
  const blogFilter: CatalogueFilterAttributeInterface[] = blogAttributes.map((attribute) => {
    const attributeOptions = blogOptions.filter((option) => {
      return option.optionsGroupId.equals(attribute.optionsGroupId);
    });

    const castedOptions: CatalogueFilterAttributeOptionInterface[] = attributeOptions.map(
      (option) => {
        const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
        const isSelected = realFilterOptions.includes(optionSlug);
        const optionName = `${option.name}`;

        const optionNextSlug = isSelected
          ? [...realFilterOptions]
              .filter((pathArg) => {
                return pathArg !== optionSlug;
              })
              .join('/')
          : [...realFilterOptions, optionSlug].join('/');

        const castedOption: CatalogueFilterAttributeOptionInterface = {
          _id: option._id,
          slug: option.slug,
          isSelected,
          name: optionName,
          nextSlug: `${basePath}/${optionNextSlug}`,
          castedSlug: optionNextSlug,
        };
        return castedOption;
      },
    );

    const isSelected = realFilterOptions.some((param) => {
      const filterItemArr = param.split(FILTER_SEPARATOR);
      return filterItemArr[0] === attribute.slug;
    });

    const otherSelectedValues = realFilterOptions.filter((param) => {
      const castedParam = castCatalogueParamToObject(param);
      return castedParam.slug !== attribute.slug;
    });
    const clearSlug = `${basePath}/${otherSelectedValues.join('/')}`;

    const filterAttribute: CatalogueFilterAttributeInterface = {
      _id: attribute._id,
      slug: attribute.slug,
      clearSlug,
      isSelected,
      name: `${attribute.name}`,
      options: castedOptions,
      notShowAsAlphabet: true,
      childrenCount: attributeOptions.length,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    };
    return filterAttribute;
  });

  const topPostsLimit = 5;
  const topPosts = [...posts]
    .sort((a, b) => {
      return noNaN(b.views) - noNaN(a.views);
    })
    .slice(0, topPostsLimit);

  return {
    props: {
      ...props,
      posts: castDbData(posts),
      topPosts: castDbData(topPosts),
      blogFilter: castDbData(blogFilter),
      meta: metaList.join(', '),
    },
  };
};

export default BlogListPage;
