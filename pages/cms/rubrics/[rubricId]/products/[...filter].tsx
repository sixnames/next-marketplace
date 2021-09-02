import Accordion from 'components/Accordion';
import AppContentFilter from 'components/AppContentFilter';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import Currency from 'components/Currency';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateNewProductModalInterface } from 'components/Modal/CreateNewProductModal';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import {
  FILTER_SEPARATOR,
  DEFAULT_PAGE,
  QUERY_FILTER_PAGE,
  ROUTE_CMS,
  SORT_DESC,
} from 'config/common';
import { getPriceAttribute } from 'config/constantAttributes';
import { CONFIRM_MODAL, CREATE_NEW_PRODUCT_MODAL } from 'config/modalVariants';
import {
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { getCatalogueRubricPipeline } from 'db/dao/constantPipelines';
import { RubricAttributeModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AppPaginationInterface,
  CatalogueFilterAttributeInterface,
  CatalogueProductPricesInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { useDeleteProductFromRubricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import usePageLoadingState from 'hooks/usePageLoadingState';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsRubricLayout from 'layout/CmsLayout/CmsRubricLayout';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueAttributes } from 'lib/catalogueUtils';
import { getFieldStringLocale, getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface RubricProductsInterface extends AppPaginationInterface<ProductInterface> {
  rubric: RubricInterface;
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  rubricAttributesCount: number;
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
  itemPath,
  rubricAttributesCount,
}) => {
  const router = useRouter();
  const setPageHandler = useNavigateToPageHandler();
  const isPageLoading = usePageLoadingState();
  const { onErrorCallback, onCompleteCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteProductFromRubricMutation] = useDeleteProductFromRubricMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromRubric),
  });

  const columns: TableColumn<ProductInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <Link testId={`product-link-${rowIndex}`} href={`${itemPath}/${dataItem._id}`}>
            {dataItem.itemId}
          </Link>
        );
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
    {
      accessor: 'barcode',
      headTitle: 'Штрих-код',
      render: ({ cellData }) => {
        const barcode = alwaysArray(cellData);
        return (
          <div>
            {barcode.map((barcodeItem, index) => {
              const isLastItem = barcode.length === index + 1;
              return (
                <span key={index}>
                  {barcodeItem}
                  {isLastItem ? '' : ', '}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      accessor: 'attributesCount',
      headTitle: 'Атрибуты',
      render: ({ cellData }) => {
        return (
          <div className='flex gap-2'>
            <div>{noNaN(cellData)}</div>
            <div>/</div>
            <div>{noNaN(rubricAttributesCount)}</div>
          </div>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.originalName}`}
              copyTitle={'Копировать товар'}
              copyHandler={() => {
                showModal<CreateNewProductModalInterface>({
                  variant: CREATE_NEW_PRODUCT_MODAL,
                  props: {
                    rubricId: `${rubric._id}`,
                    product: dataItem,
                  },
                });
              }}
              updateTitle={'Редактировать товар'}
              updateHandler={() => {
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => {
                  console.log(e);
                });
              }}
              deleteTitle={'Удалить товар из рубрики'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-product-modal',
                    message: `Вы уверенны, что хотите удалить товар ${dataItem.originalName}?`,
                    confirm: () => {
                      showLoading();
                      deleteProductFromRubricMutation({
                        variables: {
                          input: {
                            rubricId: rubric._id,
                            productId: dataItem._id,
                          },
                        },
                      }).catch((e) => console.log(e));
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  const catalogueCounterString = React.useMemo(() => {
    const counter = noNaN(totalDocs);

    if (counter < 1) {
      return `Найдено ${counter} наименований`;
    }
    const catalogueCounterPostfix = getNumWord(totalDocs, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Найдено ${counter} ${catalogueCounterPostfix}`;
  }, [totalDocs]);

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Товары',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner testId={'rubric-products-list'}>
        <div className={`text-xl font-medium mb-2`}>{catalogueCounterString}</div>

        <FormikRouterSearch testId={'products'} />

        <div className={`max-w-full`}>
          <div className={'mb-8'}>
            <Accordion
              title={'Фильтр'}
              titleRight={
                selectedAttributes.length > 0 ? (
                  <Link href={`${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`}>
                    Очистить фильтр
                  </Link>
                ) : null
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
            <div className={`relative overflow-x-auto overflow-y-hidden`}>
              <Table<ProductInterface>
                onRowDoubleClick={(dataItem) => {
                  router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
                }}
                columns={columns}
                data={docs}
                testIdKey={'_id'}
              />

              {isPageLoading ? <Spinner isNestedAbsolute /> : null}
            </div>

            <Pager
              page={page}
              totalPages={totalPages}
              setPage={(newPage) => {
                setPageHandler(newPage);
              }}
            />

            <FixedButtons>
              <Button
                testId={'create-rubric-product'}
                size={'small'}
                onClick={() => {
                  showModal<CreateNewProductModalInterface>({
                    variant: CREATE_NEW_PRODUCT_MODAL,
                    props: {
                      rubricId: `${rubric._id}`,
                    },
                  });
                }}
              >
                Создать товар
              </Button>
            </FixedButtons>
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
  docs: ProductInterface[];
  totalDocs: number;
  totalPages: number;
  prices: CatalogueProductPricesInterface[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
  rubric: RubricInterface;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricProductsPageInterface>> => {
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const rubricAttributesCollection = db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
  const { query } = context;
  const { filter, search } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context });

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

  // Cast filters
  const { realFilterOptions, noFiltersSelected, page, skip, limit, clearSlug } =
    castCatalogueFilters({
      filters: restFilter,
    });

  const basePath = `${ROUTE_CMS}/rubrics/${rubricId}/products/${rubricId}/${QUERY_FILTER_PAGE}${FILTER_SEPARATOR}1`;
  const itemPath = `${ROUTE_CMS}/rubrics/${rubricId}/products/product`;

  // Products stages
  const optionsStage = noFiltersSelected
    ? {}
    : {
        selectedOptionsSlugs: {
          $all: realFilterOptions,
        },
      };

  // algolia
  let searchIds: ObjectId[] = [];
  if (search) {
    searchIds = await getAlgoliaProductsSearch({
      indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
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

      const payload: RubricProductsInterface = {
        rubric: {
          ...(rubric || {}),
          attributes: [],
          name: getFieldStringLocale(rubric?.nameI18n, locale),
        },
        clearSlug: basePath,
        totalDocs: 0,
        totalPages: 0,
        rubricAttributesCount: 0,
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
    .aggregate<ProductsAggregationInterface>(
      [
        {
          $match: {
            rubricId: new ObjectId(`${rubricId}`),
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
                  from: COL_PRODUCT_ATTRIBUTES,
                  as: 'attributesCount',
                  let: { productId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$productId', '$productId'],
                        },
                      },
                    },
                    {
                      $project: {
                        _id: true,
                      },
                    },
                  ],
                },
              },
              {
                $lookup: {
                  from: COL_SHOP_PRODUCTS,
                  as: 'shopProducts',
                  let: { productId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$productId', '$productId'],
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
                  attributesCount: {
                    $size: '$attributesCount',
                  },
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
      ],
      { allowDiskUse: true },
    )
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
    selectedOptionsSlugs: [],
    attributes: [getPriceAttribute(), ...(rubric?.attributes || [])],
    locale: initialProps.props.sessionLocale,
    filters: restFilter,
    productsPrices: [],
    basePath,
  });
  // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

  const docs: ProductInterface[] = [];
  for await (const product of productsResult.docs) {
    const cardPrices = {
      _id: new ObjectId(),
      min: `${noNaN(product.cardPrices?.min)}`,
      max: `${noNaN(product.cardPrices?.max)}`,
    };
    docs.push({
      ...product,
      cardPrices,
      name: getFieldStringLocale(product.nameI18n, locale),
    });
  }

  // count rubric attributes
  const rubricAttributesCount = await rubricAttributesCollection.countDocuments({
    rubricId: rubric._id,
  });

  const payload: RubricProductsInterface = {
    rubric: {
      ...(rubric || {}),
      attributes: [],
      name: getFieldStringLocale(rubric?.nameI18n, locale),
    },
    clearSlug,
    totalDocs: productsResult.totalDocs,
    totalPages: productsResult.totalPages,
    hasNextPage: productsResult.hasNextPage,
    hasPrevPage: productsResult.hasPrevPage,
    attributes: castedAttributes,
    rubricAttributesCount,
    itemPath,
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
