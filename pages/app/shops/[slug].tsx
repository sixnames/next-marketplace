import AssetsManager from 'components/Assets/AssetsManager';
import Button from 'components/Buttons/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import FormikDropZone from 'components/FormElements/Upload/FormikDropZone';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import ShopMainFields from 'components/FormTemplates/ShopMainFields';
import Inner from 'components/Inner/Inner';
import InnerWide from 'components/Inner/InnerWide';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal/ProductSearchModal';
import { ShopProductModalInterface } from 'components/Modal/ShopProductModal/ShopProductModal';
import Pager from 'components/Pager/Pager';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import TabsContent from 'components/TabsContent/TabsContent';
import { CONFIRM_MODAL, PRODUCT_SEARCH_MODAL, SHOP_PRODUCT_MODAL } from 'config/modals';
import { Form, Formik } from 'formik';
import {
  ShopFragment,
  ShopProductFragment,
  UpdateShopInput,
  useAddProductToShopMutation,
  useAddShopAssetsMutation,
  useDeleteProductFromShopMutation,
  useDeleteShopAssetMutation,
  useGetCompanyShopQuery,
  useGetShopProductsQuery,
  useUpdateShopAssetIndexMutation,
  useUpdateShopLogoMutation,
  useUpdateShopMutation,
  useUpdateShopProductMutation,
} from 'generated/apolloComponents';
import {
  COMPANY_SHOP_QUERY,
  SHOP_PRODUCTS_QUERY,
  SHOP_QUERY,
} from 'graphql/query/companiesQueries';
import useDataLayoutMethods from 'hooks/useDataLayoutMethods';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useTabsConfig from 'hooks/useTabsConfig';
import useValidationSchema from 'hooks/useValidationSchema';
import AppLayout from 'layout/AppLayout/AppLayout';
import RowWithGap from 'layout/RowWithGap/RowWithGap';
import { noNaN } from 'lib/numbers';
import { phoneToRaw } from 'lib/phoneUtils';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import { NavItemInterface } from 'types/clientTypes';
import { addShopAssetsSchema, updateShopSchema } from 'validation/shopSchema';

interface ShopDetailsInterface {
  shop: ShopFragment;
}

const ShopDetails: React.FC<ShopDetailsInterface> = ({ shop }) => {
  const {
    showLoading,
    onCompleteCallback,
    onErrorCallback,
    showErrorNotification,
  } = useMutationCallbacks();
  const [updateShopMutation] = useUpdateShopMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShop),
    refetchQueries: [
      {
        query: COMPANY_SHOP_QUERY,
        variables: {
          slug: shop.slug,
        },
      },
    ],
  });
  const validationSchema = useValidationSchema({
    schema: updateShopSchema,
  });

  const initialValues: UpdateShopInput = {
    name: shop.name,
    shopId: shop._id,
    citySlug: shop.city.slug,
    contacts: {
      emails: shop.contacts.emails[0] ? shop.contacts.emails : [''],
      phones: shop.contacts.phones[0] ? shop.contacts.phones : [''],
    },
    address: {
      formattedAddress: shop.address.formattedAddress,
      point: {
        lat: shop.address.point.coordinates[1],
        lng: shop.address.point.coordinates[0],
      },
    },
  };

  return (
    <Inner testId={'shop-details'}>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          const { address } = values;
          if (!address) {
            showErrorNotification({
              title: 'Укажите адрес магазина',
            });
            return;
          }

          showLoading();
          updateShopMutation({
            variables: {
              input: {
                ...values,
                contacts: {
                  ...values.contacts,
                  phones: values.contacts.phones.map((phone) => {
                    const rawPhone = phoneToRaw(phone);
                    return rawPhone;
                  }),
                },
              },
            },
          }).catch((e) => console.log(e));
        }}
      >
        {() => {
          return (
            <Form>
              <ShopMainFields />

              <Button type={'submit'} testId={'shop-submit'}>
                Сохранить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

interface ShopProductsInterface {
  shop: ShopFragment;
}

const ShopProducts: React.FC<ShopProductsInterface> = ({ shop }) => {
  const { setPage, page, contentFilters } = useDataLayoutMethods();

  const shopProductsVariables = {
    shopId: `${shop._id}`,
    input: {
      page: noNaN(contentFilters.page) || 1,
    },
  };

  const { data, loading, error } = useGetShopProductsQuery({
    variables: shopProductsVariables,
  });

  const {
    showModal,
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });

  const refetchQueries = [
    {
      query: SHOP_PRODUCTS_QUERY,
      variables: shopProductsVariables,
    },
  ];

  const [deleteProductFromShopMutation] = useDeleteProductFromShopMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromShop),
    onError: onErrorCallback,
    refetchQueries,
  });

  const [updateShopProductMutation] = useUpdateShopProductMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.updateShopProduct),
    onError: onErrorCallback,
    refetchQueries,
  });

  const [addProductToShopMutation] = useAddProductToShopMutation({
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.addProductToShop),
    onError: onErrorCallback,
    refetchQueries,
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getShop) {
    return <RequestError />;
  }

  const { shopProducts } = data.getShop;
  const { totalPages, docs } = shopProducts;
  const excludedProductsIds = docs.map(({ product }) => product._id);

  const columns: TableColumn<ShopProductFragment>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem }) => dataItem.product.itemId,
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        const { name, mainImage } = dataItem.product;
        return <TableRowImage src={mainImage} alt={name} title={name} />;
      },
    },
    {
      accessor: 'product.name',
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
            updateTitle={'Редактировать товар'}
            updateHandler={() => {
              showModal<ShopProductModalInterface>({
                variant: SHOP_PRODUCT_MODAL,
                props: {
                  title: 'Обновление товара',
                  shopProduct: dataItem,
                  confirm: (values) => {
                    showLoading();
                    updateShopProductMutation({
                      variables: {
                        input: {
                          ...values,
                          shopProductId: dataItem._id,
                          productId: dataItem.product._id,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification();
                    });
                  },
                },
              });
            }}
            deleteTitle={'Удалить товар из магазина'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-product-modal',
                  message: `Вы уверенны, что хотите удалить ${dataItem.product.name} из магазина?`,
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
            testId={dataItem._id}
          />
        );
      },
    },
  ];

  return (
    <Inner testId={'shop-products'}>
      <RowWithGap>
        <Table<ShopProductFragment> columns={columns} data={docs} testIdKey={'slug'} />
      </RowWithGap>

      <RowWithGap>
        <Button
          onClick={() => {
            showModal<ProductSearchModalInterface>({
              variant: PRODUCT_SEARCH_MODAL,
              props: {
                createTitle: 'Выбрать товар',
                testId: 'product-search-modal',
                excludedProductsIds,
                createHandler: (product) => {
                  showModal<ShopProductModalInterface>({
                    variant: SHOP_PRODUCT_MODAL,
                    props: {
                      title: 'Добавление товара',
                      shopProduct: {
                        price: 0,
                        available: 0,
                        product: {
                          _id: product._id,
                          itemId: product.itemId,
                          mainImage: product.mainImage,
                          name: product.name,
                        },
                      },
                      confirm: (values) => {
                        showLoading();
                        addProductToShopMutation({
                          variables: {
                            input: {
                              ...values,
                              productId: product._id,
                              shopId: `${shop._id}`,
                            },
                          },
                        }).catch(() => {
                          showErrorNotification();
                        });
                      },
                    },
                  });
                },
              },
            });
          }}
          testId={'add-shop-product'}
          size={'small'}
        >
          Добавить товар
        </Button>
      </RowWithGap>

      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </Inner>
  );
};

interface ShopAssetsInterface {
  shop: ShopFragment;
}

const ShopAssets: React.FC<ShopAssetsInterface> = ({ shop }) => {
  const { _id, slug, logo, name } = shop;
  const {
    onErrorCallback,
    showErrorNotification,
    onCompleteCallback,
    showLoading,
  } = useMutationCallbacks({});
  const validationSchema = useValidationSchema({
    schema: addShopAssetsSchema,
  });

  const refetchQueries = [
    {
      query: SHOP_QUERY,
      variables: {
        _id,
      },
    },
  ];

  const [updateShopLogoMutation] = useUpdateShopLogoMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShopLogo),
    refetchQueries,
  });

  const [addShopAssetsMutation] = useAddShopAssetsMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.addShopAssets),
    refetchQueries,
  });

  const [deleteShopAssetMutation] = useDeleteShopAssetMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteShopAsset),
    refetchQueries,
  });

  const [updateShopAssetIndexMutation] = useUpdateShopAssetIndexMutation({
    awaitRefetchQueries: true,
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateShopAssetIndex),
    refetchQueries,
  });

  return (
    <InnerWide testId={'shop-assets'}>
      <Formik
        enableReinitialize
        initialValues={{ logo: [logo.url] }}
        onSubmit={(values) => console.log(values)}
      >
        {({ values: { logo } }) => {
          const isEmpty = !logo || !logo.length;

          return (
            <Form>
              <FormikImageUpload
                label={'Логотип магазина'}
                name={'logo'}
                testId={slug}
                width={'10rem'}
                height={'10rem'}
                format={'image/png'}
                setImageHandler={(files) => {
                  if (files) {
                    showLoading();
                    updateShopLogoMutation({
                      variables: {
                        input: {
                          shopId: _id,
                          logo: [files[0]],
                        },
                      },
                    }).catch(() => showErrorNotification());
                  }
                }}
              >
                {isEmpty ? (
                  <div className={`text-[var(--red) mt-[1rem]] font-medium`}>
                    Логотип обязателен к заполнению
                  </div>
                ) : null}
              </FormikImageUpload>
            </Form>
          );
        }}
      </Formik>

      <AssetsManager
        initialAssets={shop.assets}
        assetsTitle={name}
        onRemoveHandler={(assetIndex) => {
          deleteShopAssetMutation({
            variables: {
              input: {
                shopId: _id,
                assetIndex,
              },
            },
          }).catch((e) => console.log(e));
        }}
        onReorderHandler={({ assetNewIndex, assetUrl }) => {
          updateShopAssetIndexMutation({
            variables: {
              input: {
                shopId: _id,
                assetNewIndex,
                assetUrl,
              },
            },
          }).catch((e) => console.log(e));
        }}
      />

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{ assets: [], shopId: _id }}
        onSubmit={(values, formikHelpers) => {
          showLoading();
          addShopAssetsMutation({
            variables: {
              input: values,
            },
            update: () => {
              formikHelpers.resetForm();
            },
          }).catch((e) => console.log(e));
        }}
      >
        {() => {
          return (
            <Form noValidate>
              <FormikDropZone
                tooltip={'Подсказка для загрузки изображения'}
                label={'Добавить изображения'}
                name={'assets'}
                testId={'product-images'}
              />

              <Button testId={'submit-product'} type={'submit'}>
                Добавить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </InnerWide>
  );
};

const ShopRoute: React.FC = () => {
  const { query } = useRouter();
  const { slug } = query;
  const { generateTabsConfig } = useTabsConfig();
  const { data, loading, error } = useGetCompanyShopQuery({
    fetchPolicy: 'network-only',
    variables: {
      slug: `${slug}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getShopBySlug) {
    return <RequestError />;
  }

  // Shop nav tabs config
  const navConfig: NavItemInterface[] = generateTabsConfig({
    config: [
      {
        name: 'Детали',
        testId: 'details',
      },
      {
        name: 'Товары',
        testId: 'products',
      },
      {
        name: 'Изображения',
        testId: 'assets',
      },
    ],
  });

  return (
    <DataLayout
      title={data.getShopBySlug.name}
      filterResultNavConfig={navConfig}
      filterResult={() => (
        <DataLayoutContentFrame>
          <TabsContent>
            <ShopDetails shop={data.getShopBySlug} />
            <ShopProducts shop={data.getShopBySlug} />
            <ShopAssets shop={data.getShopBySlug} />
          </TabsContent>
        </DataLayoutContentFrame>
      )}
    />
  );
};

const CompanyShops: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout title={'Магазины компании'} pageUrls={pageUrls}>
      <ShopRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default CompanyShops;
