import Button from 'components/Buttons/Button';
import ShopMainFields from 'components/FormTemplates/ShopMainFields';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { COL_SHOPS } from 'db/collectionNames';
import { ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { Form, Formik } from 'formik';
import { UpdateShopInput, useUpdateShopMutation } from 'generated/apolloComponents';
import { COMPANY_SHOP_QUERY } from 'graphql/query/companiesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useShopAppNav from 'hooks/useShopAppNav';
import useValidationSchema from 'hooks/useValidationSchema';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { phoneToRaw } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateShopSchema } from 'validation/shopSchema';

/*interface ShopProductsInterface {
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
*/

interface ShopRouteInterface {
  shop: ShopModel;
}

const ShopRoute: React.FC<ShopRouteInterface> = ({ shop }) => {
  const navConfig = useShopAppNav({ shopId: `${shop._id}` });
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
    citySlug: shop.citySlug,
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
    <div className={'pt-11'}>
      <Head>
        <title>{`Магазин ${shop.name}`}</title>
      </Head>

      <Inner lowBottom>
        <Title>Магазин {shop.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner>
        <div data-cy={'shop-details'}>
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
        </div>
      </Inner>
    </div>
  );
};

interface CompanyShopInterface extends PagePropsInterface, ShopRouteInterface {}

const CompanyShop: NextPage<CompanyShopInterface> = ({ pageUrls, shop }) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopRoute shop={shop} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopInterface>> => {
  const db = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShop;
