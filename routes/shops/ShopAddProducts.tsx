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
import { CATALOGUE_OPTION_SEPARATOR, QUERY_FILTER_PAGE } from 'config/common';
import {
  AppPaginationInterface,
  CatalogueFilterAttributeInterface,
  ProductInterface,
  ShopInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  AddProductToShopInput,
  useAddManyProductsToShopMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { getNumWord } from 'lib/i18n';
import { useRouter } from 'next/router';
import * as React from 'react';
import { addManyProductsToShopSchema } from 'validation/shopSchema';

export type ShopAddProductsStepType = 1 | 2;
export type ShopAddProductsCreateChosenProduct = (product: ProductInterface) => void;
export type ShopAddProductsDeleteChosenProduct = (product: ProductInterface) => void;
export type ShopAddProductsSetStepHandler = (step: ShopAddProductsStepType) => void;

export interface ShopAddProductsListInterface extends AppPaginationInterface<ProductInterface> {
  shop: ShopInterface;
  chosen: ProductInterface[];
  createChosenProduct: ShopAddProductsCreateChosenProduct;
  deleteChosenProduct: ShopAddProductsDeleteChosenProduct;
  setStepHandler: ShopAddProductsSetStepHandler;
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  clearSlug: string;
  rubricName: string;
  rubricId: string;
  pagerUrl: string;
  layoutBasePath: string;
}

export const ShopAddProductsList: React.FC<ShopAddProductsListInterface> = ({
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
  layoutBasePath,
}) => {
  const router = useRouter();
  const columns: TableColumn<ProductInterface>[] = [
    {
      render: ({ dataItem, rowIndex }) => {
        const isSelected = chosen.find(({ _id }) => {
          return _id === dataItem._id;
        });

        return (
          <Checkbox
            testId={`product-${rowIndex}`}
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
    <AppShopLayout shop={shop} basePath={layoutBasePath}>
      <Inner testId={`not-in-shop-products-list`}>
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
                  testId={'next-step'}
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
                  testId={'next-step'}
                  size={'small'}
                >
                  Далее
                </Button>
              </div>
            </div>

            <Pager
              page={page}
              setPage={(page) => {
                const pageParam = `${QUERY_FILTER_PAGE}${CATALOGUE_OPTION_SEPARATOR}${page}`;
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

export const ShopAddProductsFinalStep: React.FC<ShopAddProductsListInterface> = ({
  shop,
  chosen,
  createChosenProduct,
  deleteChosenProduct,
  setStepHandler,
  rubricId,
  layoutBasePath,
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
          .push(`${layoutBasePath}/${shop._id}/products/${rubricId}`)
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
    <AppShopLayout shop={shop} basePath={layoutBasePath}>
      <Inner testId={'not-in-shop-products-list-step-2'}>
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
                          testId={'save-shop-products'}
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
                          testId={'save-shop-products'}
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