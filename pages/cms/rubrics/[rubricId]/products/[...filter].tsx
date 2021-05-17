import Accordion from 'components/Accordion/Accordion';
import AppContentFilter from 'components/AppContentFilter/AppContentFilter';
import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Currency from 'components/Currency/Currency';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { CreateNewProductModalInterface } from 'components/Modal/CreateNewProductModal/CreateNewProductModal';
import Pager from 'components/Pager/Pager';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import {
  QUERY_FILTER_PAGE,
  CATALOGUE_OPTION_SEPARATOR,
  PAGE_DEFAULT,
  ROUTE_CMS,
  SORT_DESC,
} from 'config/common';
import { getPriceAttribute } from 'config/constantAttributes';
import { CONFIRM_MODAL, CREATE_NEW_PRODUCT_MODAL } from 'config/modals';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { getCatalogueRubricPipeline } from 'db/constantPipelines';
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
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsRubricLayout from 'layout/CmsLayout/CmsRubricLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueAttributes } from 'lib/catalogueUtils';
import { getCurrencyString, getFieldStringLocale, getNumWord } from 'lib/i18n';
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
  itemPath,
}) => {
  const router = useRouter();
  const isPageLoading = usePageLoadingState();
  const {
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    hideLoading,
    showModal,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });
  const [deleteProductFromRubricMutation] = useDeleteProductFromRubricMutation({
    onError: onErrorCallback,
    onCompleted: ({ deleteProductFromRubric }) => {
      if (deleteProductFromRubric.success) {
        hideLoading();
        onCompleteCallback(deleteProductFromRubric);
        router.reload();
      } else {
        hideLoading();
        showErrorNotification({ title: deleteProductFromRubric.message });
      }
    },
  });
  const columns: TableColumn<ProductInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem }) => {
        return <Link href={`${itemPath}/${dataItem._id}`}>{dataItem.itemId}</Link>;
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
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            deleteTitle={'Удалить товар из рубрики'}
            justifyContent={'flex-end'}
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
        );
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
                const pageParam = `${QUERY_FILTER_PAGE}${CATALOGUE_OPTION_SEPARATOR}${newPage}`;
                const prevUrlArray = pagerUrl.split('/').filter((param) => param);
                const nextUrl = [...prevUrlArray, pageParam].join('/');
                router.push(`/${nextUrl}`).catch((e) => {
                  console.log(e);
                });
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
  const db = await getDatabase();
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const { query } = context;
  const { filter, search } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context, isCms: true });
  const basePath = `${ROUTE_CMS}/rubrics/${rubricId}/products/${rubricId}`;
  const itemPath = `${ROUTE_CMS}/rubrics/${rubricId}/products/product`;

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
  const {
    realFilterOptions,
    noFiltersSelected,
    pagerUrl,
    page,
    skip,
    limit,
    clearSlug,
  } = castCatalogueFilters({
    filters: restFilter,
    basePath,
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
              $gt: [page, PAGE_DEFAULT],
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
  const { rubric } = productsResult;
  const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
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
      min: getCurrencyString(product.cardPrices?.min),
      max: getCurrencyString(product.cardPrices?.max),
    };
    docs.push({
      ...product,
      cardPrices,
      name: getFieldStringLocale(product.nameI18n, locale),
    });
  }

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
    pagerUrl: `${basePath}${pagerUrl}`,
    basePath,
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
