import Accordion from 'components/Accordion/Accordion';
import AppContentFilter from 'components/AppContentFilter/AppContentFilter';
import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import { CONFIRM_MODAL } from 'config/modals';
import { ShopProductModel } from 'db/dbModels';
import {
  AppPaginationInterface,
  CatalogueFilterAttributeInterface,
  ShopInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  useDeleteProductFromShopMutation,
  useUpdateManyShopProductsMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import { getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updateManyShopProductsSchema } from 'validation/shopSchema';

export interface ShopRubricProductsInterface
  extends AppPaginationInterface<ShopProductInterface>,
    AppShopLayoutInterface {
  shop: ShopInterface;
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  clearSlug: string;
  rubricName: string;
  rubricId: string;
  layoutBasePath: string;
}

const ShopRubricProducts: React.FC<ShopRubricProductsInterface> = ({
  shop,
  attributes,
  clearSlug,
  selectedAttributes,
  docs,
  totalDocs,
  page,
  totalPages,
  rubricName,
  basePath,
  rubricId,
  layoutBasePath,
}) => {
  const router = useRouter();
  const setPageHandler = useNavigateToPageHandler();
  const {
    showModal,
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true, reload: true });

  const addProductsPath = `${layoutBasePath}/${shop._id}/products/add/${rubricId}`;
  const validationSchema = useValidationSchema({ schema: updateManyShopProductsSchema });

  const withProducts = docs.length > 0;

  const [updateManyShopProductsMutation] = useUpdateManyShopProductsMutation({
    onCompleted: (data) => onCompleteCallback(data.updateManyShopProducts),
    onError: onErrorCallback,
  });

  const [deleteProductFromShopMutation] = useDeleteProductFromShopMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromShop),
    onError: onErrorCallback,
  });

  const columns: TableColumn<ShopProductInterface>[] = [
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
            testId={'shop-product-main-image'}
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
    {
      accessor: 'barcode',
      headTitle: 'Штрих-код',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem, rowIndex }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            deleteTitle={'Удалить товар из магазина'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: `delete-shop-product-modal`,
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
            testId={`shop-product-${rowIndex}`}
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
    return `Найдено ${noNaN(totalDocs)} ${catalogueCounterPostfix}`;
  }, [totalDocs]);

  const initialValues = {
    input: docs.map((shopProduct) => {
      return {
        ...shopProduct,
        shopProductId: shopProduct._id,
      };
    }),
  };

  return (
    <AppShopLayout shop={shop} basePath={layoutBasePath}>
      <Inner testId={`shop-rubric-products-list`}>
        <div className={`text-3xl font-medium mb-2`}>{rubricName}</div>
        <div className={`mb-6`}>{catalogueCounterString}</div>

        {withProducts ? (
          <FormikIndividualSearch
            withReset
            onReset={() => {
              router.push(basePath).catch((e) => console.log(e));
            }}
            onSubmit={(search) => {
              router.push(`${basePath}?search=${search}`).catch((e) => console.log(e));
            }}
          />
        ) : null}

        <div className={`max-w-full`}>
          {withProducts ? (
            <div className={'mb-8'}>
              <Accordion
                title={'Фильтр'}
                titleRight={
                  selectedAttributes.length > 0 ? (
                    <Link href={clearSlug}>Очистить фильтр</Link>
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
          ) : null}

          <div className={'max-w-full'}>
            <Formik
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const updatedProducts: ShopProductModel[] = [];
                values.input.forEach((shopProduct, index) => {
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
            >
              {() => {
                return (
                  <Form>
                    <div className={`overflow-x-auto`}>
                      <Table<ShopProductInterface>
                        columns={columns}
                        data={docs}
                        testIdKey={'_id'}
                      />
                    </div>
                    <FixedButtons>
                      {withProducts ? (
                        <Button testId={'save-shop-products'} type={'submit'} size={'small'}>
                          Сохранить
                        </Button>
                      ) : null}

                      <Button
                        onClick={() => {
                          router.push(addProductsPath).catch((e) => console.log(e));
                        }}
                        testId={'add-shop-product'}
                        size={'small'}
                      >
                        Добавить товары
                      </Button>
                    </FixedButtons>
                  </Form>
                );
              }}
            </Formik>

            <Pager
              page={page}
              totalPages={totalPages}
              setPage={(newPage) => {
                setPageHandler(newPage);
              }}
            />
          </div>
        </div>
      </Inner>
    </AppShopLayout>
  );
};

export default ShopRubricProducts;
