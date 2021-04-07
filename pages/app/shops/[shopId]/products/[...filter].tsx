import Accordion from 'components/Accordion/Accordion';
import AppContentFilter from 'components/AppContentFilter/AppContentFilter';
import Button from 'components/Buttons/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
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
import { CONFIRM_MODAL } from 'config/modals';
import { COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import {
  CatalogueFilterAttributeModel,
  CatalogueProductOptionInterface,
  CatalogueProductPricesInterface,
  ShopModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { Form, Formik } from 'formik';
import {
  useDeleteProductFromShopMutation,
  useUpdateManyShopProductsMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { alwaysArray } from 'lib/arrayUtils';
import {
  castCatalogueFilters,
  getCatalogueAttributes,
  getCatalogueRubric,
  getRubricCatalogueAttributes,
} from 'lib/catalogueUtils';
import { getFieldStringLocale, getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ShopProductsListRouteInterface {
  shop: ShopModel;
  docs: ShopProductModel[];
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  attributes: CatalogueFilterAttributeModel[];
  selectedAttributes: CatalogueFilterAttributeModel[];
  clearSlug: string;
  rubricName: string;
  pagerUrl: string;
  basePath: string;
}

const ShopProductsListRoute: React.FC<ShopProductsListRouteInterface> = ({
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
}) => {
  const router = useRouter();
  const {
    showModal,
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });

  const [updateManyShopProductsMutation] = useUpdateManyShopProductsMutation({
    onCompleted: (data) => {
      onCompleteCallback(data.updateManyShopProducts);
      router.reload();
    },
    onError: onErrorCallback,
  });

  const [deleteProductFromShopMutation] = useDeleteProductFromShopMutation({
    onCompleted: (data) => {
      onCompleteCallback(data.deleteProductFromShop);
      router.reload();
    },
    onError: onErrorCallback,
  });

  const columns: TableColumn<ShopProductModel>[] = [
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
            alt={`${dataItem.name}`}
            title={`${dataItem.name}`}
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
      headTitle: 'Наличие',
      render: ({ rowIndex }) => {
        return (
          <FormikInput
            testId={`shop-product-available-${rowIndex}`}
            name={`shopProducts[${rowIndex}].available`}
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
            name={`shopProducts[${rowIndex}].price`}
            type={'number'}
            low
          />
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            deleteTitle={'Удалить товар из магазина'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-product-modal',
                  message: `Вы уверенны, что хотите удалить ${dataItem.originalName} из магазина?`,
                  confirm: () => {
                    showLoading();
                    deleteProductFromShopMutation({
                      variables: {
                        input: {
                          shopProductId: dataItem._id,
                          shopId: `${shop._id}`,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification();
                    });
                  },
                },
              });
            }}
            testId={`${dataItem._id}`}
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
    <AppShopLayout shop={shop}>
      <Inner>
        <div className={`text-3xl font-medium mb-2`}>{rubricName}</div>
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
            <Formik
              enableReinitialize={true}
              onSubmit={(values) => {
                const updatedProducts: ShopProductModel[] = [];
                values.shopProducts.forEach((shopProduct, index) => {
                  const initialShopProduct = docs[index];
                  if (
                    initialShopProduct &&
                    (initialShopProduct.available !== noNaN(shopProduct.available) ||
                      initialShopProduct.price !== noNaN(shopProduct.price))
                  ) {
                    updatedProducts.push(shopProduct);
                  }
                });
                if (updatedProducts.length > 0) {
                  showLoading();

                  updateManyShopProductsMutation({
                    variables: {
                      input: updatedProducts.map(({ productId, price, available, _id }) => {
                        return {
                          shopProductId: `${_id}`,
                          productId: `${productId}`,
                          price: noNaN(price),
                          available: noNaN(available),
                        };
                      }),
                    },
                  }).catch((e) => console.log(e));
                } else {
                  showErrorNotification({
                    title: 'Нет изменённых товаров',
                  });
                }
              }}
              initialValues={{
                shopProducts: docs,
              }}
            >
              {() => {
                return (
                  <Form>
                    <div className={`mb-6 flex`}>
                      <div className={`mr-6`}>
                        <Button testId={'save-shop-products'} type={'submit'} size={'small'}>
                          Сохранить
                        </Button>
                      </div>
                      <div className={`mr-6`}>
                        <Button
                          onClick={() => {
                            console.log('Add product');
                          }}
                          testId={'add-shop-product'}
                          size={'small'}
                        >
                          Добавить товары
                        </Button>
                      </div>
                    </div>
                    <div className={`overflow-x-auto`}>
                      <Table<ShopProductModel> columns={columns} data={docs} testIdKey={'_id'} />
                    </div>
                    <div className={`mt-6 flex`}>
                      <div className={`mr-6`}>
                        <Button testId={'save-shop-products'} type={'submit'} size={'small'}>
                          Сохранить
                        </Button>
                      </div>
                      <div className={`mr-6`}>
                        <Button
                          onClick={() => {
                            console.log('Add product');
                          }}
                          testId={'add-shop-product'}
                          size={'small'}
                        >
                          Добавить товары
                        </Button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>

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

interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    ShopProductsListRouteInterface {}

const CompanyShopProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
  ...props
}) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopProductsListRoute shop={shop} {...props} />
    </AppLayout>
  );
};

interface ShopProductsAggregationInterface {
  docs: ShopProductModel[];
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
  const { query } = context;
  const { shopId, filter, search } = query;
  const [rubricId, ...restFilter] = alwaysArray(filter);
  const initialProps = await getAppInitialData({ context });
  const basePath = `${ROUTE_APP}/shops/${shopId}/products/${rubricId}`;
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

  // Get rubric
  const rubric = await getCatalogueRubric([
    {
      $match: { _id: new ObjectId(rubricId) },
    },
  ]);
  if (!rubric) {
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
    pagerUrl,
    page,
    skip,
    limit,
  } = castCatalogueFilters(restFilter);

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
        ],
      }
    : {};

  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductsAggregationInterface>([
      {
        $match: {
          rubricId: rubric._id,
          shopId: shop._id,
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
  const rubricAttributes = await getRubricCatalogueAttributes({
    config: shopProductsResult.options,
    attributes: rubric.attributes,
    city: initialProps.props.sessionCity,
  });

  const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
    attributes: rubricAttributes,
    locale: initialProps.props.sessionLocale,
    filter: restFilter,
    productsPrices: shopProductsResult.prices,
    basePath,
  });
  // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

  const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
  const payload: ShopProductsListRouteInterface = {
    shop,
    rubricName: getFieldStringLocale(rubric.nameI18n, initialProps.props?.sessionLocale),
    clearSlug: `${basePath}${sortPathname}`,
    totalDocs: shopProductsResult.totalDocs,
    totalPages: shopProductsResult.totalPages,
    hasNextPage: shopProductsResult.hasNextPage,
    hasPrevPage: shopProductsResult.hasPrevPage,
    attributes: castedAttributes,
    pagerUrl: `${basePath}${pagerUrl}`,
    basePath,
    selectedAttributes,
    page,
    docs: shopProductsResult.docs.reduce((acc: ShopProductModel[], shopProduct) => {
      const { assets, nameI18n, ...restShopProduct } = shopProduct;

      // image
      const sortedAssets = assets.sort((assetA, assetB) => {
        return assetA.index - assetB.index;
      });
      const firstAsset = sortedAssets[0];
      let mainImage = `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
      if (firstAsset) {
        mainImage = firstAsset.url;
      }

      return [
        ...acc,
        {
          ...restShopProduct,
          assets,
          nameI18n,
          mainImage,
          name: getFieldStringLocale(nameI18n, initialProps.props?.sessionLocale),
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
