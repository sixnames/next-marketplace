import AppContentFilter from 'components/AppContentFilter';
import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import ContentItemControls from 'components/button/ContentItemControls';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Pager from 'components/Pager';
import ProductsListSuppliersList from 'components/shops/ProductsListSuppliersList';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useUserContext } from 'context/userContext';
import { ShopProductModel } from 'db/dbModels';
import {
  ShopProductInterface,
  ShopRubricProductsInterface,
  SupplierProductInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useDeleteProductFromShopMutation } from 'generated/apolloComponents';
import { useUpdateManyShopProducts } from 'hooks/mutations/useShopProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import ConsoleShopLayout from 'layout/console/ConsoleShopLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updateManyShopProductsSchema } from 'validation/shopSchema';

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
  rubricId,
  layoutBasePath,
  rubricSlug,
  breadcrumbs,
  basePath,
  currency,
}) => {
  const { sessionUser } = useUserContext();
  const router = useRouter();

  const { showModal, onErrorCallback, onCompleteCallback, showLoading, showErrorNotification } =
    useMutationCallbacks({ withModal: true, reload: true });

  const addProductsPath = `${layoutBasePath}/${shop._id}/products/add/${rubricId}`;
  const validationSchema = useValidationSchema({
    schema: updateManyShopProductsSchema,
  });

  const withProducts = docs.length > 0;

  const [updateManyShopProductsMutation] = useUpdateManyShopProducts();

  const [deleteProductFromShopMutation] = useDeleteProductFromShopMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromShop),
    onError: onErrorCallback,
  });

  const columns: TableColumn<ShopProductInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'Арт',
      render: ({ dataItem }) => {
        return (
          <Link
            href={`${layoutBasePath}/${shop._id}/products/product/${dataItem._id}`}
            target={'_blank'}
          >
            {dataItem.product?.itemId}
          </Link>
        );
      },
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        return (
          <TableRowImage
            testId={'shop-product-main-image'}
            src={`${dataItem.product?.mainImage}`}
            alt={`${dataItem.product?.name}`}
            title={`${dataItem.product?.name}`}
          />
        );
      },
    },
    {
      accessor: 'product.snippetTitle',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Наличие',
      render: ({ rowIndex }) => {
        return (
          <div className='w-[90px]' data-cy={`${rowIndex}-available`}>
            <FormikInput
              testId={`shop-product-available-${rowIndex}`}
              name={`input[${rowIndex}].available`}
              type={'number'}
              min={0}
              low
            />
          </div>
        );
      },
    },
    {
      headTitle: 'Цена',
      render: ({ rowIndex }) => {
        return (
          <div className='flex items-center gap-3 w-[120px]' data-cy={`${rowIndex}-price`}>
            <FormikInput
              testId={`shop-product-price-${rowIndex}`}
              name={`input[${rowIndex}].price`}
              type={'number'}
              low
            />
            <div>{currency}</div>
          </div>
        );
      },
    },
    {
      accessor: 'supplierProducts',
      headTitle: 'Ценообразование',
      render: ({ cellData }) => {
        const supplierProducts = (cellData || []) as SupplierProductInterface[];
        return <ProductsListSuppliersList supplierProducts={supplierProducts} />;
      },
    },
    {
      accessor: 'barcode',
      headTitle: 'Штрих-код',
      render: ({ cellData }) => {
        const barcode = alwaysArray(cellData);
        return barcode.map((barcodeItem) => {
          return <div key={barcodeItem}>{barcodeItem}</div>;
        });
      },
    },
    {
      render: ({ dataItem, rowIndex }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            testId={`shop-product-${rowIndex}`}
            updateTitle={'Редактировать товар'}
            updateHandler={() => {
              window.open(
                `${layoutBasePath}/${shop._id}/products/product/${dataItem._id}`,
                '_blank',
              );
            }}
            deleteTitle={'Удалить товар из магазина'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: `delete-shop-product-modal`,
                  message: `Вы уверенны, что хотите удалить ${dataItem.product?.originalName} из магазина?`,
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
    <ConsoleShopLayout shop={shop} basePath={layoutBasePath} breadcrumbs={breadcrumbs}>
      <Inner testId={`shop-rubric-products-list`}>
        <div className={`text-3xl font-medium mb-2`}>{rubricName}</div>
        <div className={`mb-6`}>{catalogueCounterString}</div>

        <FormikRouterSearch testId={'products'} />

        <div className={`max-w-full`}>
          {withProducts ? (
            <div className={'mb-8'}>
              <AppContentFilter
                excludedParams={[rubricId]}
                rubricSlug={rubricSlug}
                basePath={basePath}
                attributes={attributes}
                selectedAttributes={selectedAttributes}
                clearSlug={clearSlug}
              />
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

                  updateManyShopProductsMutation(
                    updatedProducts.map(({ barcode, price, available, _id }) => {
                      return {
                        shopProductId: `${_id}`,
                        price: noNaN(price),
                        available: noNaN(available),
                        barcode: barcode || [],
                      };
                    }),
                  ).catch((e) => console.log(e));
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
                        onRowDoubleClick={(dataItem) => {
                          if (sessionUser?.role?.isStaff) {
                            window.open(
                              `${layoutBasePath}/${shop._id}/products/product/${dataItem._id}`,
                              '_blank',
                            );
                          }
                        }}
                      />
                    </div>
                    <FixedButtons>
                      {withProducts ? (
                        <Button
                          frameClassName='w-auto'
                          testId={'save-shop-products'}
                          type={'submit'}
                          size={'small'}
                        >
                          Сохранить
                        </Button>
                      ) : null}

                      <Button
                        frameClassName='w-auto'
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

            <Pager page={page} totalPages={totalPages} />
          </div>
        </div>
      </Inner>
    </ConsoleShopLayout>
  );
};

export default ShopRubricProducts;
