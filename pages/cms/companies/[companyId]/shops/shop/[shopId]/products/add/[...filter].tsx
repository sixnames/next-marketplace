import {
  CATALOGUE_OPTION_SEPARATOR,
  PAGE_DEFAULT,
  QUERY_FILTER_PAGE,
  ROUTE_CMS,
  SORT_DESC,
} from 'config/common';
import { getPriceAttribute } from 'config/constantAttributes';
import {
  COL_COMPANIES,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { getCatalogueRubricPipeline } from 'db/constantPipelines';
import { ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CatalogueProductOptionInterface,
  CatalogueProductPricesInterface,
  ProductInterface,
  RubricInterface,
  ShopInterface,
} from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueAttributes } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import {
  ShopAddProductsCreateChosenProduct,
  ShopAddProductsDeleteChosenProduct,
  ShopAddProductsFinalStep,
  ShopAddProductsList,
  ShopAddProductsListInterface,
  ShopAddProductsSetStepHandler,
  ShopAddProductsStepType,
} from 'components/shops/ShopAddProducts';

type ShopAddProductsListRouteReduced = Omit<
  ShopAddProductsListInterface,
  'chosen' | 'createChosenProduct' | 'deleteChosenProduct' | 'setStepHandler' | 'layoutBasePath'
>;

interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    ShopAddProductsListRouteReduced {}

const CompanyShopAddProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
  rubricName,
  rubricId,
  ...props
}) => {
  const [chosen, setChosen] = React.useState<ProductInterface[]>([]);
  const [step, setStep] = React.useState<ShopAddProductsStepType>(1);
  const companyBasePath = `${ROUTE_CMS}/companies/${shop.companyId}`;
  const layoutBasePath = `${companyBasePath}/shops/shop`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Добавление товаров',
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
      {
        name: rubricName,
        href: `${companyBasePath}/shops/shop/${shop._id}/products/${rubricId}`,
      },
    ],
  };

  const createChosenProduct: ShopAddProductsCreateChosenProduct = (product) => {
    setChosen((prevState) => {
      return [...prevState, product];
    });
  };

  const deleteChosenProduct: ShopAddProductsDeleteChosenProduct = (product) => {
    setChosen((prevState) => {
      const filteredProducts = prevState.filter(({ _id }) => _id !== product._id);
      return filteredProducts;
    });
  };

  const setStepHandler: ShopAddProductsSetStepHandler = (step) => {
    setStep(step);
  };

  if (step === 2) {
    return (
      <CmsLayout pageUrls={pageUrls}>
        <ShopAddProductsFinalStep
          breadcrumbs={breadcrumbs}
          rubricName={rubricName}
          rubricId={rubricId}
          layoutBasePath={layoutBasePath}
          createChosenProduct={createChosenProduct}
          deleteChosenProduct={deleteChosenProduct}
          setStepHandler={setStepHandler}
          chosen={chosen}
          shop={shop}
          {...props}
        />
      </CmsLayout>
    );
  }

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopAddProductsList
        breadcrumbs={breadcrumbs}
        rubricName={rubricName}
        rubricId={rubricId}
        layoutBasePath={layoutBasePath}
        createChosenProduct={createChosenProduct}
        deleteChosenProduct={deleteChosenProduct}
        setStepHandler={setStepHandler}
        chosen={chosen}
        shop={shop}
        {...props}
      />
    </CmsLayout>
  );
};

interface ProductsAggregationInterface {
  docs: ProductInterface[];
  rubric: RubricInterface;
  totalDocs: number;
  totalPages: number;
  prices: CatalogueProductPricesInterface[];
  options: CatalogueProductOptionInterface[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsListInterface>> => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
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
  const locale = initialProps.props.sessionLocale;
  // const city = shop.citySlug;

  // Cast filters
  const { realFilterOptions, sortFilterOptions, noFiltersSelected, page, skip, limit } =
    castCatalogueFilters({
      filters: restFilter,
    });

  const basePath = `${ROUTE_CMS}/companies/${query.companyId}/shops/shop/${shopId}/products/add/${rubricId}/${QUERY_FILTER_PAGE}${CATALOGUE_OPTION_SEPARATOR}1`;

  // Products stages
  const optionsStage = noFiltersSelected
    ? {}
    : {
        selectedOptionsSlugs: {
          $all: realFilterOptions,
        },
      };

  const rubricIdObjectId = new ObjectId(rubricId);

  const shopProductsAggregation = await shopProductsCollection
    .aggregate([
      {
        $match: {
          rubricId: rubricIdObjectId,
          shopId: shop._id,
        },
      },
      {
        $project: {
          productId: true,
        },
      },
    ])
    .toArray();
  const excludedProductsIds = shopProductsAggregation.map(({ productId }) => productId);

  // algolia
  let searchIds: ObjectId[] = [];
  if (search) {
    searchIds = await getAlgoliaProductsSearch({
      indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
      search: `${search}`,
      excludedProductsIds,
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

      const payload: ShopAddProductsListRouteReduced = {
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

  const productsAggregation = await productsCollection
    .aggregate<ProductsAggregationInterface>([
      {
        $match: {
          rubricId: rubricIdObjectId,
          _id: { $nin: excludedProductsIds },
          ...searchStage,
          ...optionsStage,
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
                  $split: ['$_id', CATALOGUE_OPTION_SEPARATOR],
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
            $gt: [page, PAGE_DEFAULT],
          },
          hasNextPage: {
            $lt: [page, '$totalPages'],
          },
        },
      },
    ])
    .toArray();
  const productsResult = productsAggregation[0];
  if (!productsResult) {
    return {
      notFound: true,
    };
  }
  // console.log(productsResult);
  // console.log('After products ', new Date().getTime() - startTime);

  // Get filter attributes
  // const beforeOptions = new Date().getTime();
  let rubric: RubricInterface | null = productsResult.rubric;
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
    attributes: [getPriceAttribute(), ...(rubric.attributes || [])],
    locale: initialProps.props.sessionLocale,
    filters: restFilter,
    productsPrices: [],
    basePath,
  });
  // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

  const docs: ProductInterface[] = [];
  for await (const facet of productsResult.docs) {
    docs.push({
      ...facet,
      name: getFieldStringLocale(facet.nameI18n, locale),
    });
  }

  const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
  const payload: ShopAddProductsListRouteReduced = {
    shop,
    rubricId: rubric._id.toHexString(),
    rubricName: getFieldStringLocale(rubric.nameI18n, initialProps.props?.sessionLocale),
    clearSlug: `${basePath}${sortPathname}`,
    totalDocs: productsResult.totalDocs,
    totalPages: productsResult.totalPages,
    hasNextPage: productsResult.hasNextPage,
    hasPrevPage: productsResult.hasPrevPage,
    attributes: castedAttributes,
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

export default CompanyShopAddProductsList;
