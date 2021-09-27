import {
  FILTER_SEPARATOR,
  QUERY_FILTER_PAGE,
  ROUTE_CMS,
  SORT_DESC,
  DEFAULT_SORT_STAGE,
} from 'config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getPriceAttribute,
} from 'config/constantAttributes';
import {
  COL_COMPANIES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  brandPipeline,
  filterAttributesPipeline,
  filterCmsBrandsPipeline,
  filterCmsCategoriesPipeline,
  getCatalogueRubricPipeline,
  productCategoriesPipeline,
} from 'db/dao/constantPipelines';
import { getDatabase } from 'db/mongodb';
import {
  RubricInterface,
  ShopInterface,
  ShopProductInterface,
  ShopProductsAggregationInterface,
} from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueAttributes } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getCategoryAllAttributes, getRubricAllAttributes } from 'lib/productAttributesUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import ShopRubricProducts, {
  ShopRubricProductsInterface,
} from 'components/shops/ShopRubricProducts';

interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    Omit<ShopRubricProductsInterface, 'layoutBasePath'> {}

const CompanyShopProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
  rubricName,
  ...props
}) => {
  const companyBasePath = `${ROUTE_CMS}/companies/${shop.companyId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: rubricName,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${shop.company?.name}`,
        href: companyBasePath,
      },
      {
        name: 'Магазины',
        href: `${companyBasePath}/shops/${shop.companyId}`,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shops/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shops/shop/${shop._id}/products`,
      },
    ],
  };

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopRubricProducts
        breadcrumbs={breadcrumbs}
        layoutBasePath={`${companyBasePath}/shops/shop`}
        shop={shop}
        rubricName={rubricName}
        {...props}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsListInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);

  const { query } = context;
  const { shopId, filter, search } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context });

  // console.log(' ');
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  // console.log('CompanyShopProductsList props ');
  // const startTime = new Date().getTime();

  // Get shop
  const shopAggregation = await shopsCollection
    .aggregate([
      {
        $match: { _id: new ObjectId(`${shopId}`) },
      },
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'company',
          foreignField: '_id',
          localField: 'companyId',
        },
      },
      {
        $addFields: {
          company: {
            $arrayElemAt: ['$company', 0],
          },
        },
      },
    ])
    .toArray();
  const shop = shopAggregation[0];
  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  // Cast filters
  const {
    sortFilterOptions,
    brandStage,
    brandCollectionStage,
    pricesStage,
    optionsStage,
    page,
    skip,
    limit,
  } = castCatalogueFilters({
    filters: restFilter,
  });
  const basePath = `${ROUTE_CMS}/companies/${query.companyId}/shops/shop/${shopId}/products/${rubricId}/${QUERY_FILTER_PAGE}${FILTER_SEPARATOR}1`;

  // algolia
  let searchIds: ObjectId[] = [];
  if (search) {
    searchIds = await getAlgoliaProductsSearch({
      indexName: `${process.env.ALG_INDEX_SHOP_PRODUCTS}`,
      search: `${search}`,
    });

    // return empty page if no search results
    if (searchIds.length < 1) {
      const rubric = await rubricsCollection.findOne({
        _id: new ObjectId(rubricId),
      });

      if (!rubric) {
        return {
          notFound: true,
        };
      }

      const payload: Omit<ShopRubricProductsInterface, 'layoutBasePath'> = {
        shop,
        rubricId: rubric._id.toHexString(),
        rubricName: getFieldStringLocale(rubric.nameI18n, initialProps.props?.sessionLocale),
        clearSlug: basePath,
        totalDocs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
        attributes: [],
        selectedAttributes: [],
        basePath,
        page,
        docs: [],
      };

      const castedPayload = castDbData(payload);

      return {
        props: {
          ...initialProps.props,
          ...castedPayload,
        },
      };
    }
  }
  const searchStage =
    search && search.length > 0 && searchIds.length > 0
      ? {
          _id: {
            $in: searchIds,
          },
        }
      : {};

  const rubricsPipeline = getCatalogueRubricPipeline();

  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductsAggregationInterface>([
      {
        $match: {
          shopId: shop._id,
          rubricId: new ObjectId(rubricId),
          ...brandStage,
          ...brandCollectionStage,
          ...optionsStage,
          ...pricesStage,
          ...searchStage,
        },
      },
      {
        $facet: {
          docs: [
            {
              $sort: {
                _id: SORT_DESC,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },

            // Lookup product brand
            ...brandPipeline,

            // Lookup product categories
            ...productCategoriesPipeline(),

            // Lookup product attributes
            {
              $lookup: {
                from: COL_PRODUCT_ATTRIBUTES,
                as: 'attributes',
                let: { productId: '$productId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$productId', '$productId'],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: COL_OPTIONS,
                      as: 'options',
                      let: {
                        optionsGroupId: '$optionsGroupId',
                        selectedOptionsIds: '$selectedOptionsIds',
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                {
                                  $eq: ['$optionsGroupId', '$$optionsGroupId'],
                                },
                                {
                                  $in: ['$_id', '$$selectedOptionsIds'],
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                attributesCount: {
                  $size: '$attributes',
                },
              },
            },
          ],
          options: [
            {
              $project: {
                selectedOptionsSlugs: 1,
              },
            },
            {
              $unwind: '$selectedOptionsSlugs',
            },
            {
              $group: {
                _id: '$selectedOptionsSlugs',
              },
            },
            {
              $addFields: {
                slugArray: {
                  $split: ['$_id', FILTER_SEPARATOR],
                },
              },
            },
            {
              $addFields: {
                attributeSlug: {
                  $arrayElemAt: ['$slugArray', 0],
                },
              },
            },
            {
              $group: {
                _id: '$attributeSlug',
                optionsSlugs: {
                  $addToSet: '$_id',
                },
              },
            },
          ],
          prices: [
            {
              $project: {
                price: 1,
              },
            },
            {
              $group: {
                _id: '$price',
              },
            },
          ],
          countAllDocs: [
            {
              $count: 'totalDocs',
            },
          ],

          // get rubrics
          rubrics: rubricsPipeline,

          // get categories
          categories: filterCmsCategoriesPipeline,

          // get brands and brand collections
          brands: filterCmsBrandsPipeline,

          // get attributes
          attributes: filterAttributesPipeline(DEFAULT_SORT_STAGE),
        },
      },
      {
        $addFields: {
          totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
          rubric: { $arrayElemAt: ['$rubrics', 0] },
        },
      },
      {
        $addFields: {
          totalDocs: '$totalDocsObject.totalDocs',
        },
      },
      {
        $addFields: {
          totalPagesFloat: {
            $divide: ['$totalDocs', limit],
          },
        },
      },
      {
        $addFields: {
          totalPages: {
            $ceil: '$totalPagesFloat',
          },
        },
      },
    ])
    .toArray();
  const shopProductsResult = shopProductsAggregation[0];
  if (!shopProductsResult) {
    return {
      notFound: true,
    };
  }
  // console.log(shopProductsResult.docs[0]);
  // console.log('After products ', new Date().getTime() - startTime);

  // Get filter attributes
  // const beforeOptions = new Date().getTime();
  let rubric: RubricInterface | null = shopProductsResult.rubric;
  if (!rubric) {
    rubric = await rubricsCollection.findOne({
      _id: new ObjectId(rubricId),
    });
  }
  if (!rubric) {
    return {
      notFound: true,
    };
  }

  const locale = initialProps.props.sessionLocale;

  // price attribute
  const priceAttribute = getPriceAttribute();

  // category attribute
  const categoryAttribute = getCategoryFilterAttribute({
    locale,
    categories: shopProductsResult.categories,
  });

  // brand attribute
  const brandAttribute = getBrandFilterAttribute({
    locale,
    brands: shopProductsResult.brands,
  });

  // rubric attributes
  const rubricAttributes = shopProductsResult.attributes || [];

  const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
    attributes: [priceAttribute, categoryAttribute, brandAttribute, ...rubricAttributes],
    locale: initialProps.props.sessionLocale,
    filters: restFilter,
    productsPrices: shopProductsResult.prices,
    basePath,
  });
  // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

  // rubric attributes
  const allRubricAttributes = await getRubricAllAttributes(rubricId);

  const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
  const docs: ShopProductInterface[] = [];
  for await (const shopProduct of shopProductsResult.docs) {
    const { nameI18n, ...restProduct } = shopProduct;

    const productCategoryAttributes = await getCategoryAllAttributes(
      shopProduct.selectedOptionsSlugs,
    );

    // title
    const snippetTitle = generateSnippetTitle({
      locale,
      brand: restProduct.brand,
      rubricName: getFieldStringLocale(rubric?.nameI18n, locale),
      showRubricNameInProductTitle: rubric?.showRubricNameInProductTitle,
      showCategoryInProductTitle: rubric?.showCategoryInProductTitle,
      attributes: restProduct.attributes || [],
      categories: restProduct.categories,
      titleCategoriesSlugs: restProduct.titleCategoriesSlugs,
      originalName: restProduct.originalName,
      defaultGender: restProduct.gender,
    });

    docs.push({
      ...restProduct,
      snippetTitle,
      nameI18n,
      name: getFieldStringLocale(nameI18n, locale),
      totalAttributesCount: allRubricAttributes.length + productCategoryAttributes.length,
    });
  }

  const payload: Omit<ShopRubricProductsInterface, 'layoutBasePath'> = {
    shop,
    rubricId: rubric._id.toHexString(),
    rubricName: getFieldStringLocale(rubric.nameI18n, initialProps.props?.sessionLocale),
    clearSlug: `${basePath}${sortPathname}`,
    totalDocs: shopProductsResult.totalDocs,
    totalPages: shopProductsResult.totalPages,
    hasNextPage: shopProductsResult.hasNextPage,
    hasPrevPage: shopProductsResult.hasPrevPage,
    attributes: castedAttributes,
    basePath,
    selectedAttributes,
    page,
    docs,
  };

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
    },
  };
};

export default CompanyShopProductsList;
