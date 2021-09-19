import { FILTER_SEPARATOR, DEFAULT_PAGE, ROUTE_CONSOLE, SORT_DESC } from 'config/common';
import { getPriceAttribute } from 'config/constantAttributes';
import {
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  brandPipeline,
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
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueAttributes } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
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
  currentCompany,
  ...props
}) => {
  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: rubricName,
    config: [
      {
        name: 'Магазины',
        href: companyBasePath,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shop/${shop._id}/products`,
      },
    ],
  };

  return (
    <ConsoleLayout pageUrls={pageUrls} company={currentCompany}>
      <ShopRubricProducts
        rubricName={rubricName}
        breadcrumbs={breadcrumbs}
        layoutBasePath={`${companyBasePath}/shop`}
        shop={shop}
        {...props}
      />
    </ConsoleLayout>
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
  const initialProps = await getConsoleInitialData({ context });
  const basePath = `${ROUTE_CONSOLE}/${query.companyId}/shops/shop/${shopId}/products/${rubricId}`;

  // console.log(' ');
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  // console.log('CompanyShopProductsList props ');
  // const startTime = new Date().getTime();
  // Get shop
  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });
  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  // Cast filters
  const {
    minPrice,
    maxPrice,
    realFilterOptions,
    sortFilterOptions,
    noFiltersSelected,
    page,
    skip,
    limit,
  } = castCatalogueFilters({
    filters: restFilter,
  });

  // Products stages
  const pricesStage =
    minPrice && maxPrice
      ? {
          price: {
            $gte: minPrice,
            $lte: maxPrice,
          },
        }
      : {};

  const optionsStage = noFiltersSelected
    ? {}
    : {
        selectedOptionsSlugs: {
          $all: realFilterOptions,
        },
      };

  const languages = initialProps.props.initialData.languages;
  const searchByName = languages.map(({ slug }) => {
    return {
      [`nameI18n.${slug}`]: {
        $regex: search,
        $options: 'i',
      },
    };
  });
  const searchStage = search
    ? {
        $or: [
          ...searchByName,
          {
            originalName: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            itemId: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            barcode: {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const rubricsPipeline = getCatalogueRubricPipeline();

  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductsAggregationInterface>([
      {
        $match: {
          shopId: shop._id,
          rubricId: new ObjectId(rubricId),
          ...searchStage,
          ...pricesStage,
          ...optionsStage,
        },
      },
      {
        $facet: {
          docs: [
            {
              $sort: {
                createdAt: SORT_DESC,
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
          rubrics: rubricsPipeline,
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
      {
        $project: {
          docs: 1,
          rubric: 1,
          totalDocs: 1,
          options: 1,
          prices: 1,
          totalPages: 1,
          hasPrevPage: {
            $gt: [page, DEFAULT_PAGE],
          },
          hasNextPage: {
            $lt: [page, '$totalPages'],
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

  const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
    selectedOptionsSlugs: [],
    attributes: [getPriceAttribute(), ...(rubric.attributes || [])],
    locale: initialProps.props.sessionLocale,
    filters: restFilter,
    productsPrices: shopProductsResult.prices,
    basePath,
  });
  // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

  const locale = initialProps.props?.sessionLocale;
  const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
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
    rubricAttributesCount: 0,
    basePath,
    selectedAttributes,
    page,
    docs: shopProductsResult.docs.reduce((acc: ShopProductInterface[], shopProduct) => {
      const { nameI18n, ...restProduct } = shopProduct;

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
        nameI18n,
        originalName: restProduct.originalName,
        defaultGender: restProduct.gender,
      });

      return [
        ...acc,
        {
          ...restProduct,
          snippetTitle,
          nameI18n,
          name: getFieldStringLocale(nameI18n, locale),
        },
      ];
    }, []),
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
