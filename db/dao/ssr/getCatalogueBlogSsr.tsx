import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_PAGE,
  FILTER_SEPARATOR,
  PAGE_STATE_PUBLISHED,
  ROUTE_BLOG,
  SORT_DESC,
} from '../../../config/common';
import { alwaysArray } from '../../../lib/arrayUtils';
import { castUrlFilters } from '../../../lib/castUrlFilters';
import { castCatalogueParamToObject } from '../../../lib/catalogueUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import { noNaN } from '../../../lib/numbers';
import { castDbData, getSiteInitialData } from '../../../lib/ssrUtils';
import { BlogListPageInterface } from '../../../pages/blog/[...filters]';
import {
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_LIKES,
  COL_BLOG_POSTS,
  COL_OPTIONS,
} from '../../collectionNames';
import { AttributeViewVariantModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import {
  BlogAttributeInterface,
  BlogPostInterface,
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
  OptionInterface,
} from '../../uiInterfaces';

export const getCatalogueBlogSsr = async (
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

  const locale = props.sessionLocale;
  const filters = alwaysArray(context.query?.filters);

  // Cast selected filters
  const { realFilters, noFiltersSelected } = await castUrlFilters({
    filters,
    initialPage: DEFAULT_PAGE,
    initialLimit: CATALOGUE_PRODUCTS_LIMIT,
    searchFieldName: '_id',
  });

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);
  const basePath = ROUTE_BLOG;

  const viewsStage = {
    $addFields: {
      views: { $max: `$views.${props.companySlug}.${props.citySlug}` },
    },
  };

  const filtersStage = noFiltersSelected
    ? {}
    : {
        filterSlugs: {
          $all: realFilters,
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
        const attributeName = getFieldStringLocale(attribute.nameI18n, locale);
        if (!attributeName) {
          return acc;
        }

        // cast options
        const options = (attribute.options || []).reduce(
          (optionsAcc: OptionInterface[], option) => {
            const name = getFieldStringLocale(option.nameI18n, locale);
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
      title: getFieldStringLocale(post.titleI18n, locale),
      description: getFieldStringLocale(post.descriptionI18n, locale),
      attributes,
      options: postOptions,
    };
  });

  // filter
  const blogFilter: CatalogueFilterAttributeInterface[] = blogAttributes.map((attribute) => {
    const attributeOptions = blogOptions.filter((option) => {
      return option.optionsGroupId.equals(attribute.optionsGroupId);
    });

    const castedOptions: CatalogueFilterAttributeOptionInterface[] = attributeOptions.map(
      (option) => {
        const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
        const isSelected = realFilters.includes(optionSlug);
        const optionName = `${option.name}`;

        const optionNextSlug = isSelected
          ? [...realFilters]
              .filter((pathArg) => {
                return pathArg !== optionSlug;
              })
              .join('/')
          : [...realFilters, optionSlug].join('/');

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

    const isSelected = realFilters.some((param) => {
      const filterItemArr = param.split(FILTER_SEPARATOR);
      return filterItemArr[0] === attribute.slug;
    });

    const otherSelectedValues = realFilters.filter((param) => {
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
      showAsLinkInFilter: false,
      showAsAccordionInFilter: false,
    };
    return filterAttribute;
  });

  const topPostsLimit = 5;
  const topPosts = [...posts]
    .sort((a, b) => {
      return noNaN(b.views) - noNaN(a.views);
    })
    .slice(0, topPostsLimit);

  // blog title
  const blogTitlePrefixConfig = props.initialData.configs.blogTitlePrefix;
  const blogTitlePrefix = blogTitlePrefixConfig ? `${blogTitlePrefixConfig} ` : '';
  const blogTitlePostfixConfig = props.initialData.configs.blogTitlePostfix;
  const blogTitlePostfix = blogTitlePostfixConfig ? ` ${blogTitlePostfixConfig}` : '';

  const selectedOptions = blogFilter
    .reduce((acc: CatalogueFilterAttributeOptionInterface[], attribute) => {
      const { isSelected, options } = attribute;
      if (!isSelected) {
        return acc;
      }
      const selectedOptions = options.filter(({ isSelected }) => isSelected);
      return [...acc, ...selectedOptions];
    }, [])
    .map(({ name }) => name.toLocaleLowerCase(locale));

  const titleFilters = selectedOptions.length > 0 ? ` на тему ${selectedOptions.join(', ')}` : '';

  const blogTitle = `${blogTitlePrefix}${blogTitlePostfix}${titleFilters}`;

  return {
    props: {
      ...props,
      posts: castDbData(posts),
      topPosts: castDbData(topPosts),
      blogFilter: castDbData(blogFilter),
      blogTitle,
      showForIndex: true,
    },
  };
};
