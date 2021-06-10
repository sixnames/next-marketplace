import algoliasearch from 'algoliasearch';
import { CATALOGUE_OPTION_SEPARATOR, PAGE_DEFAULT, ROUTE_CMS, SORT_DESC } from 'config/common';
import { getPriceAttribute } from 'config/constantAttributes';
import { ALG_INDEX_PRODUCTS } from 'db/algoliaIndexes';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
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
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueAttributes } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
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
} from 'routes/shops/ShopAddProducts';

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
  ...props
}) => {
  const router = useRouter();
  const [chosen, setChosen] = React.useState<ProductInterface[]>([]);
  const [step, setStep] = React.useState<ShopAddProductsStepType>(1);
  const layoutBasePath = `${ROUTE_CMS}/companies/${router.query.companyId}/shops/shop`;

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
  const { query } = context;
  const { shopId, filter, search } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context });
  const basePath = `${ROUTE_CMS}/companies/${query.companyId}/shops/shop/${shopId}/products/add/${rubricId}`;

  // console.log(' ');
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  // console.log('CompanyShopProductsList props ');
  // const startTime = new Date().getTime();

  // algolia
  const algoliaClient = algoliasearch(
    `${process.env.ALGOLIA_APP_ID}`,
    `${process.env.ALGOLIA_API_KEY}`,
  );
  const shopProductsIndex = algoliaClient.initIndex(ALG_INDEX_PRODUCTS);
  const searchIds: ObjectId[] = [];
  if (search) {
    const { hits } = await shopProductsIndex.search<ProductInterface>(`${search}`);
    hits.forEach((hit) => {
      searchIds.push(new ObjectId(hit._id));
    });
  }
  const searchStage = search
    ? {
        _id: {
          $in: searchIds,
        },
      }
    : {};

  // Get shop
  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });
  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  // const city = shop.citySlug;

  // Cast filters
  const {
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
  const { rubric } = productsResult;
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

export default CompanyShopAddProductsList;
