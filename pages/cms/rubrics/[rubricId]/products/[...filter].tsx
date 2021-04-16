import Accordion from 'components/Accordion/Accordion';
import AppContentFilter from 'components/AppContentFilter/AppContentFilter';
import Currency from 'components/Currency/Currency';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import Pager from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import {
  CATALOGUE_FILTER_PAGE,
  CATALOGUE_OPTION_SEPARATOR,
  PAGE_DEFAULT,
  ROUTE_CMS,
  SORT_DESC,
} from 'config/common';
import { COL_PRODUCT_FACETS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import {
  CatalogueFilterAttributeModel,
  CatalogueProductOptionInterface,
  CatalogueProductPricesInterface,
  ProductFacetModel,
  RubricModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsRubricLayout from 'layout/CmsLayout/CmsRubricLayout';
import { alwaysArray } from 'lib/arrayUtils';
import {
  castCatalogueFilters,
  getCatalogueAttributes,
  getCatalogueRubric,
  getRubricCatalogueAttributes,
} from 'lib/catalogueUtils';
import { getCurrencyString, getFieldStringLocale, getNumWord } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface RubricProductsInterface {
  rubric: RubricModel;
  docs: ProductFacetModel[];
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  attributes: CatalogueFilterAttributeModel[];
  selectedAttributes: CatalogueFilterAttributeModel[];
  clearSlug: string;
  pagerUrl: string;
  basePath: string;
}

const RubricProductsConsumer: React.FC<RubricProductsInterface> = ({
  rubric,
  attributes,
  clearSlug,
  selectedAttributes,
  docs,
  totalDocs,
  page,
  totalPages,
  pagerUrl,
  basePath,
}) => {
  const router = useRouter();
  const columns: TableColumn<ProductFacetModel>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem }) => {
        return <Link href={`${basePath}/product/${dataItem._id}`}>{dataItem.itemId}</Link>;
      },
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        return (
          <TableRowImage
            src={`${dataItem.mainImage}`}
            alt={`${dataItem.originalName}`}
            title={`${dataItem.originalName}`}
          />
        );
      },
    },
    {
      accessor: 'originalName',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'shopsCount',
      headTitle: 'В магазинах',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'cardPrices.min',
      headTitle: 'Мин. цена',
      render: ({ cellData }) => {
        return <Currency value={cellData} noZeroValue />;
      },
    },
    {
      accessor: 'cardPrices.max',
      headTitle: 'Макс. цена',
      render: ({ cellData }) => {
        return <Currency value={cellData} noZeroValue />;
      },
    },
  ];

  const catalogueCounterString = React.useMemo(() => {
    const catalogueCounterPostfix = getNumWord(totalDocs, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Найдено ${totalDocs} ${catalogueCounterPostfix}`;
  }, [totalDocs]);

  return (
    <CmsRubricLayout rubric={rubric}>
      <Inner>
        <div className={`text-xl font-medium mb-2`}>{catalogueCounterString}</div>

        <FormikIndividualSearch
          withReset
          onReset={() => {
            router.push(basePath).catch((e) => console.log(e));
          }}
          onSubmit={(search) => {
            router.push(`${basePath}?search=${search}`).catch((e) => console.log(e));
          }}
        />

        <div className={`max-w-full`}>
          <div className={'mb-8'}>
            <Accordion
              title={'Фильтр'}
              titleRight={
                selectedAttributes.length > 0 ? <Link href={clearSlug}>Очистить фильтр</Link> : null
              }
            >
              <div className={`mt-8`}>
                <AppContentFilter
                  attributes={attributes}
                  selectedAttributes={selectedAttributes}
                  clearSlug={clearSlug}
                  className={`grid gap-x-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`}
                />
              </div>
            </Accordion>
          </div>

          <div className={'max-w-full'}>
            <div className={`overflow-x-auto`}>
              <Table<ProductFacetModel>
                onRowDoubleClick={(dataItem) => {
                  router.push(`${basePath}/product/${dataItem._id}`).catch((e) => console.log(e));
                }}
                columns={columns}
                data={docs}
                testIdKey={'_id'}
              />
            </div>

            <Pager
              page={page}
              setPage={(page) => {
                const pageParam = `${CATALOGUE_FILTER_PAGE}${CATALOGUE_OPTION_SEPARATOR}${page}`;
                const prevUrlArray = pagerUrl.split('/').filter((param) => param);
                const nextUrl = [...prevUrlArray, pageParam].join('/');
                router.push(`/${nextUrl}`).catch((e) => {
                  console.log(e);
                });
              }}
              totalPages={totalPages}
            />
          </div>
        </div>
      </Inner>
    </CmsRubricLayout>
  );
};

interface RubricProductsPageInterface extends PagePropsInterface, RubricProductsInterface {}

const RubricProducts: NextPage<RubricProductsPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricProductsConsumer {...props} />
    </CmsLayout>
  );
};

interface ProductsAggregationInterface {
  docs: ProductFacetModel[];
  totalDocs: number;
  totalPages: number;
  prices: CatalogueProductPricesInterface[];
  options: CatalogueProductOptionInterface[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricProductsPageInterface>> => {
  const db = await getDatabase();
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const { query } = context;
  const { filter, search } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context, isCms: true });
  const basePath = `${ROUTE_CMS}/rubrics/${rubricId}/products/${rubricId}`;

  // console.log(' ');
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  // console.log('RubricProductsPage props ');
  // const startTime = new Date().getTime();
  // Get shop
  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  // const city = shop.citySlug;

  // Get rubric
  const rubric = await getCatalogueRubric([
    {
      $match: { _id: new ObjectId(`${rubricId}`) },
    },
  ]);
  if (!rubric) {
    return {
      notFound: true,
    };
  }

  // Cast filters
  const {
    realFilterOptions,
    sortFilterOptions,
    noFiltersSelected,
    pagerUrl,
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
        ],
      }
    : {};

  const productsAggregation = await productFacetsCollection
    .aggregate<ProductsAggregationInterface>([
      {
        $match: {
          rubricId: rubric._id,
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
            {
              $lookup: {
                from: COL_SHOP_PRODUCTS,
                as: 'shopProducts',
                let: { facetId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$facetId', '$productId'],
                      },
                    },
                  },
                  {
                    $project: {
                      price: true,
                      available: true,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                shopsCount: {
                  $size: '$shopProducts',
                },
                cardPrices: {
                  min: {
                    $min: '$shopProducts.price',
                  },
                  max: {
                    $max: '$shopProducts.price',
                  },
                },
              },
            },
            {
              $project: {
                shopProducts: false,
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
        },
      },
      {
        $addFields: {
          totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
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
  const rubricAttributes = await getRubricCatalogueAttributes({
    config: productsResult.options,
    attributes: rubric.attributes,
    city: initialProps.props.sessionCity,
  });

  const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
    attributes: rubricAttributes,
    locale: initialProps.props.sessionLocale,
    filter: restFilter,
    productsPrices: [],
    basePath,
  });
  // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

  const docs: ProductFacetModel[] = [];
  for await (const facet of productsResult.docs) {
    const cardPrices = {
      min: getCurrencyString(facet.cardPrices?.min),
      max: getCurrencyString(facet.cardPrices?.max),
    };
    docs.push({
      ...facet,
      cardPrices,
      name: getFieldStringLocale(facet.nameI18n, locale),
    });
  }

  const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
  const payload: RubricProductsInterface = {
    rubric: {
      ...rubric,
      attributes: [],
      name: getFieldStringLocale(rubric.nameI18n, locale),
    },
    clearSlug: `${basePath}${sortPathname}`,
    totalDocs: productsResult.totalDocs,
    totalPages: productsResult.totalPages,
    hasNextPage: productsResult.hasNextPage,
    hasPrevPage: productsResult.hasPrevPage,
    attributes: castedAttributes,
    pagerUrl: `${basePath}${pagerUrl}`,
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

export default RubricProducts;
