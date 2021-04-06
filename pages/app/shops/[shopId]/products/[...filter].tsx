import Button from 'components/Buttons/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner/Inner';
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
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import {
  CatalogueFilterAttributeModel,
  CatalogueProductOptionInterface,
  CatalogueProductPricesInterface,
  ShopModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { useDeleteProductFromShopMutation } from 'generated/apolloComponents';
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
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CatalogueFilter from 'routes/CatalogueRoute/CatalogueFilter';

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
}) => {
  const router = useRouter();
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  const {
    showModal,
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });

  const [deleteProductFromShopMutation] = useDeleteProductFromShopMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      onCompleteCallback(data.deleteProductFromShop);
      router.reload();
    },
    onError: onErrorCallback,
  });

  const columns: TableColumn<ShopProductModel>[] = [
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
            alt={`${cellData.name}`}
            title={`${cellData.name}`}
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
      render: ({ dataItem }) => {
        return <div data-cy={`${dataItem._id}-available`}>{dataItem.available}</div>;
      },
    },
    {
      headTitle: 'Цена',
      render: ({ dataItem }) => {
        return <div data-cy={`${dataItem._id}-price`}>{dataItem.price}</div>;
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
                  message: `Вы уверенны, что хотите удалить ${dataItem.product?.name} из магазина?`,
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
        <div className={`text-3xl font-medium mb-6`}>{rubricName}</div>
        <div className={`wp-desktop:grid wp-desktop:grid-cols-6 gap-4 max-w-full`}>
          <div className={'wp-desktop:col-span-2'}>
            <CatalogueFilter
              attributes={attributes}
              selectedAttributes={selectedAttributes}
              catalogueCounterString={catalogueCounterString}
              rubricClearSlug={clearSlug}
              isFilterVisible={isFilterVisible}
              hideFilterHandler={() => setIsFilterVisible(false)}
            />
          </div>
          <div className={'wp-desktop:col-span-4 max-w-full'}>
            <div className={`overflow-x-auto`}>
              <Table<ShopProductModel> columns={columns} data={docs} testIdKey={'_id'} />
            </div>

            <div className={`mt-6 mb-3`}>
              <Button
                onClick={() => {
                  console.log('Add product');
                }}
                testId={'add-shop-product'}
                size={'small'}
              >
                Добавить товар
              </Button>
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
  const { shopId, filter } = query;
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
  // Product stages
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

  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductsAggregationInterface>([
      {
        $match: {
          rubricId: rubric._id,
          shopId: shop._id,
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
            {
              $lookup: {
                from: COL_PRODUCTS,
                as: 'products',
                let: { productId: '$productId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$productId', '$_id'],
                      },
                    },
                  },
                  {
                    $project: {
                      attributes: false,
                      shopProductsCountCities: false,
                      isCustomersChoiceCities: false,
                      connections: false,
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
    docs: shopProductsResult.docs.reduce((acc: ShopProductModel[], shopProduct) => {
      const { products, ...restShopProduct } = shopProduct;
      const product = products && products.length > 0 ? products[0] : null;
      if (!product) {
        return acc;
      }

      // image
      const sortedAssets = product.assets.sort((assetA, assetB) => {
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
          product: {
            ...product,
            name: getFieldStringLocale(product.nameI18n, initialProps.props?.sessionLocale),
            mainImage,
          },
        },
      ];
    }, []),
    rubricName: getFieldStringLocale(rubric.nameI18n, initialProps.props?.sessionLocale),
    clearSlug: `${basePath}${sortPathname}`,
    totalDocs: shopProductsResult.totalDocs,
    totalPages: shopProductsResult.totalPages,
    hasNextPage: shopProductsResult.hasNextPage,
    hasPrevPage: shopProductsResult.hasPrevPage,
    attributes: castedAttributes,
    selectedAttributes,
    page,
    pagerUrl: `${basePath}${pagerUrl}`,
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
