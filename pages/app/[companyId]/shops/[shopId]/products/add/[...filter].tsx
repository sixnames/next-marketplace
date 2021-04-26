import Accordion from 'components/Accordion/Accordion';
import AppContentFilter from 'components/AppContentFilter/AppContentFilter';
import Button from 'components/Buttons/Button';
import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import FormikInput from 'components/FormElements/Input/FormikInput';
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
  ROUTE_APP,
  SORT_DESC,
} from 'config/common';
import { getPriceAttribute } from 'config/constantAttributes';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { getCatalogueRubricPipeline } from 'db/constantPipelines';
import { ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CatalogueFilterAttributeInterface,
  CatalogueProductOptionInterface,
  CatalogueProductPricesInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  AddProductToShopInput,
  useAddManyProductsToShopMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueAttributes } from 'lib/catalogueUtils';
import { getFieldStringLocale, getNumWord } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { addManyProductsToShopSchema } from 'validation/shopSchema';

type StepType = 1 | 2;
type CreateChosenProduct = (product: ProductInterface) => void;
type DeleteChosenProduct = (product: ProductInterface) => void;
type SetStepHandler = (step: StepType) => void;

interface ShopAddProductsListRouteInterface {
  shop: ShopModel;
  docs: ProductInterface[];
  chosen: ProductInterface[];
  createChosenProduct: CreateChosenProduct;
  deleteChosenProduct: DeleteChosenProduct;
  setStepHandler: SetStepHandler;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  clearSlug: string;
  rubricName: string;
  rubricId: string;
  pagerUrl: string;
  basePath: string;
}

const ShopAddProductsListRoute: React.FC<ShopAddProductsListRouteInterface> = ({
  shop,
  attributes,
  clearSlug,
  selectedAttributes,
  docs,
  totalDocs,
  page,
  totalPages,
  rubricName,
  pagerUrl,
  basePath,
  chosen,
  createChosenProduct,
  deleteChosenProduct,
  setStepHandler,
}) => {
  const router = useRouter();
  const columns: TableColumn<ProductInterface>[] = [
    {
      render: ({ dataItem }) => {
        const isSelected = chosen.find(({ _id }) => {
          return _id === dataItem._id;
        });

        return (
          <Checkbox
            name={'chosen'}
            value={isSelected ? 'true' : ''}
            checked={Boolean(isSelected)}
            onChange={() => {
              if (isSelected) {
                deleteChosenProduct(dataItem);
              } else {
                createChosenProduct(dataItem);
              }
            }}
          />
        );
      },
    },
    {
      accessor: 'itemId',
      headTitle: 'Арт',
      render: ({ cellData }) => cellData,
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
    <AppShopLayout shop={shop}>
      <Inner>
        <div className={`text-3xl font-medium mb-2`}>Выберите товары из рубрики {rubricName}</div>
        <div className={`mb-6`}>{catalogueCounterString}</div>

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
            <div className={`mb-6 flex`}>
              <div className={`mr-6`}>
                <Button
                  disabled={chosen.length < 1}
                  onClick={() => setStepHandler(2)}
                  testId={'next-step-top'}
                  size={'small'}
                >
                  Далее
                </Button>
              </div>
            </div>
            <div className={`overflow-x-auto`}>
              <Table<ProductInterface> columns={columns} data={docs} testIdKey={'_id'} />
            </div>
            <div className={`mt-6 flex`}>
              <div className={`mr-6`}>
                <Button
                  disabled={chosen.length < 1}
                  onClick={() => setStepHandler(2)}
                  testId={'next-step-bottom'}
                  size={'small'}
                >
                  Далее
                </Button>
              </div>
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
    </AppShopLayout>
  );
};

const ShopAddProductsFinalStepRoute: React.FC<ShopAddProductsListRouteInterface> = ({
  shop,
  chosen,
  createChosenProduct,
  deleteChosenProduct,
  setStepHandler,
  rubricId,
}) => {
  const router = useRouter();
  const {
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });
  const [addManyProductsToShopMutation] = useAddManyProductsToShopMutation({
    onCompleted: (data) => {
      onCompleteCallback(data.addManyProductsToShop);
      if (data.addManyProductsToShop.success) {
        router
          .push(`${ROUTE_APP}/${router.query.companyId}/shops/${shop._id}/products/${rubricId}`)
          .catch((e) => console.log(e));
      }
    },
    onError: onErrorCallback,
  });
  const validationSchema = useValidationSchema({ schema: addManyProductsToShopSchema });

  const columns: TableColumn<ProductInterface>[] = [
    {
      render: ({ dataItem }) => {
        const isSelected = chosen.find(({ _id }) => {
          return _id === dataItem._id;
        });

        return (
          <Checkbox
            name={'chosen'}
            value={isSelected ? 'true' : ''}
            checked={Boolean(isSelected)}
            onChange={() => {
              if (isSelected) {
                deleteChosenProduct(dataItem);
              } else {
                createChosenProduct(dataItem);
              }
            }}
          />
        );
      },
    },
    {
      accessor: 'product',
      headTitle: 'Арт',
      render: ({ cellData }) => cellData.itemId,
    },
    {
      accessor: 'product',
      headTitle: 'Фото',
      render: ({ cellData }) => {
        return (
          <TableRowImage
            src={`${cellData.mainImage}`}
            alt={`${cellData.originalName}`}
            title={`${cellData.originalName}`}
          />
        );
      },
    },
    {
      accessor: 'product.originalName',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Наличие',
      render: ({ rowIndex }) => {
        return (
          <FormikInput
            testId={`shop-product-available-${rowIndex}`}
            name={`input[${rowIndex}].available`}
            type={'number'}
            low
          />
        );
      },
    },
    {
      headTitle: 'Цена',
      render: ({ rowIndex }) => {
        return (
          <FormikInput
            testId={`shop-product-price-${rowIndex}`}
            name={`input[${rowIndex}].price`}
            type={'number'}
            low
          />
        );
      },
    },
  ];

  const catalogueCounterString = React.useMemo(() => {
    const catalogueCounterPostfix = getNumWord(chosen.length, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Выбрано ${chosen.length} ${catalogueCounterPostfix}`;
  }, [chosen]);

  const initialValues = {
    input: chosen.map((facet) => {
      return {
        ...facet,
        productId: facet._id,
        shopId: shop._id,
        available: 0,
        price: 0,
      };
    }),
  };

  return (
    <AppShopLayout shop={shop}>
      <Inner>
        <div className={`text-3xl font-medium mb-2`}>Заполните все поля</div>
        <div className={`mb-6`}>{catalogueCounterString}</div>

        <div className={`max-w-full`}>
          <div className={'max-w-full'}>
            <Formik
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={(values) => {
                showLoading();
                const input: AddProductToShopInput[] = values.input.map(
                  ({ available, price, shopId, productId }) => ({
                    available,
                    price,
                    shopId,
                    productId,
                  }),
                );
                addManyProductsToShopMutation({
                  variables: {
                    input,
                  },
                }).catch(() => {
                  showErrorNotification();
                });
              }}
              initialValues={initialValues}
            >
              {() => {
                return (
                  <Form>
                    <div className={`mb-6 flex`}>
                      <div className={`mr-6`}>
                        <Button
                          disabled={chosen.length < 1}
                          testId={'save-shop-products-top'}
                          type={'submit'}
                          size={'small'}
                        >
                          Сохранить
                        </Button>
                      </div>
                      <div className={`mr-6`}>
                        <Button
                          onClick={() => setStepHandler(1)}
                          testId={'back-top'}
                          size={'small'}
                          theme={'secondary'}
                        >
                          Назад
                        </Button>
                      </div>
                    </div>
                    <div className={`overflow-x-auto`}>
                      <Table<ProductInterface> columns={columns} data={chosen} testIdKey={'_id'} />
                    </div>
                    <div className={`mt-6 flex`}>
                      <div className={`mr-6`}>
                        <Button
                          disabled={chosen.length < 1}
                          testId={'save-shop-products-bottom'}
                          type={'submit'}
                          size={'small'}
                        >
                          Сохранить
                        </Button>
                      </div>
                      <div className={`mr-6`}>
                        <Button
                          onClick={() => setStepHandler(1)}
                          testId={'back-bottom'}
                          size={'small'}
                          theme={'secondary'}
                        >
                          Назад
                        </Button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Inner>
    </AppShopLayout>
  );
};

type ShopAddProductsListRouteReduced = Omit<
  ShopAddProductsListRouteInterface,
  'chosen' | 'createChosenProduct' | 'deleteChosenProduct' | 'setStepHandler'
>;

interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    ShopAddProductsListRouteReduced {}

const CompanyShopAddProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
  ...props
}) => {
  const [chosen, setChosen] = React.useState<ProductInterface[]>([]);
  const [step, setStep] = React.useState<StepType>(1);

  const createChosenProduct: CreateChosenProduct = (product) => {
    setChosen((prevState) => {
      return [...prevState, product];
    });
  };

  const deleteChosenProduct: DeleteChosenProduct = (product) => {
    setChosen((prevState) => {
      const filteredProducts = prevState.filter(({ _id }) => _id !== product._id);
      return filteredProducts;
    });
  };

  const setStepHandler: SetStepHandler = (step) => {
    setStep(step);
  };

  if (step === 2) {
    return (
      <AppLayout pageUrls={pageUrls}>
        <ShopAddProductsFinalStepRoute
          createChosenProduct={createChosenProduct}
          deleteChosenProduct={deleteChosenProduct}
          setStepHandler={setStepHandler}
          chosen={chosen}
          shop={shop}
          {...props}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopAddProductsListRoute
        createChosenProduct={createChosenProduct}
        deleteChosenProduct={deleteChosenProduct}
        setStepHandler={setStepHandler}
        chosen={chosen}
        shop={shop}
        {...props}
      />
    </AppLayout>
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
  const db = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const { query } = context;
  const { shopId, filter, search } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context });
  const basePath = `${ROUTE_APP}/${query.companyId}/shops/${shopId}/products/add/${rubricId}`;

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
  const locale = initialProps.props.sessionLocale;
  // const city = shop.citySlug;

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

  const rubricIdObjectId = new ObjectId(rubricId);

  const shopProductsIdsAggregation = await shopProductsCollection
    .aggregate([
      {
        $match: {
          rubricId: rubricIdObjectId,
          shopId: shop._id,
        },
      },
      {
        $project: {
          _id: true,
        },
      },
    ])
    .toArray();
  const shopProductsIds = shopProductsIdsAggregation.map(({ _id }) => _id);

  const rubricsPipeline = getCatalogueRubricPipeline();

  const productsAggregation = await productsCollection
    .aggregate<ProductsAggregationInterface>([
      {
        $match: {
          rubricId: rubricIdObjectId,
          _id: { $nin: shopProductsIds },
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
    filter: restFilter,
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

export default CompanyShopAddProductsList;
