import AppContentFilter from 'components/AppContentFilter';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import { ROUTE_CMS } from 'config/common';
import { useUserContext } from 'context/userContext';
import {
  CatalogueFilterAttributeInterface,
  ConsoleRubricProductsInterface,
  ProductInterface,
  ShopInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  AddProductToShopInput,
  useAddManyProductsToShopMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useReloadListener } from 'hooks/useReloadListener';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleShopLayout from 'layout/console/ConsoleShopLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getNumWord } from 'lib/i18n';
import { useRouter } from 'next/router';
import * as React from 'react';
import { addManyProductsToShopSchema } from 'validation/shopSchema';

export type ShopAddProductsStepType = 1 | 2;
export type ShopAddProductsCreateChosenProduct = (product: ProductInterface) => void;
export type ShopAddProductsDeleteChosenProduct = (product: ProductInterface) => void;
export type ShopAddProductsSetStepHandler = (step: ShopAddProductsStepType) => void;

export interface ShopAddProductsListInterface extends ConsoleRubricProductsInterface {
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
  layoutBasePath: string;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  basePath: string;
  rubricSlug: string;
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
  chosen,
  createChosenProduct,
  deleteChosenProduct,
  setStepHandler,
  layoutBasePath,
  breadcrumbs,
  basePath,
  rubricSlug,
  rubricId,
  brandSlugs,
  categorySlugs,
}) => {
  useReloadListener();
  const { me } = useUserContext();
  const setPageHandler = useNavigateToPageHandler();

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
      headTitle: 'Арт',
      render: ({ dataItem }) => {
        return me?.role?.isStaff ? (
          <Link
            href={`${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`}
            target={'_blank'}
          >
            {dataItem.itemId}
          </Link>
        ) : (
          dataItem.itemId
        );
      },
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        return (
          <TableRowImage
            src={`${dataItem.mainImage}`}
            alt={`${dataItem.snippetTitle}`}
            title={`${dataItem.snippetTitle}`}
          />
        );
      },
    },
    {
      accessor: 'snippetTitle',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
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
      isHidden: !me?.role?.isStaff,
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать товар'}
              updateHandler={() => {
                if (me?.role?.isStaff) {
                  window.open(
                    `${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`,
                    '_blank',
                  );
                }
              }}
            />
          </div>
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
    <ConsoleShopLayout shop={shop} basePath={layoutBasePath} breadcrumbs={breadcrumbs}>
      <Inner testId={`not-in-shop-products-list`}>
        <div className={`text-3xl font-medium mb-2`}>Выберите товары из рубрики {rubricName}</div>
        <div className={`mb-6`}>{catalogueCounterString}</div>

        <FormikRouterSearch testId={'products'} />

        <div className={`max-w-full`}>
          <div className={'mb-8'}>
            <AppContentFilter
              brandSlugs={brandSlugs}
              categorySlugs={categorySlugs}
              basePath={basePath}
              rubricSlug={rubricSlug}
              attributes={attributes}
              excludedParams={[rubricId]}
              selectedAttributes={selectedAttributes}
              clearSlug={clearSlug}
              className={`grid gap-x-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`}
            />
          </div>

          <div className={'max-w-full'}>
            <div className={`overflow-x-auto`}>
              <Table<ProductInterface>
                columns={columns}
                data={docs}
                testIdKey={'_id'}
                onRowDoubleClick={(dataItem) => {
                  if (me?.role?.isStaff) {
                    window.open(
                      `${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`,
                      '_blank',
                    );
                  }
                }}
              />
            </div>
            <FixedButtons>
              <Button
                disabled={chosen.length < 1}
                onClick={() => setStepHandler(2)}
                testId={'next-step'}
                size={'small'}
              >
                Далее
              </Button>
            </FixedButtons>

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
    </ConsoleShopLayout>
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
  breadcrumbs,
}) => {
  const router = useRouter();
  const { onErrorCallback, onCompleteCallback, showLoading, showErrorNotification } =
    useMutationCallbacks({ withModal: true });
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
            alt={`${dataItem.snippetTitle}`}
            title={`${dataItem.snippetTitle}`}
          />
        );
      },
    },
    {
      accessor: 'snippetTitle',
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
    <ConsoleShopLayout shop={shop} basePath={layoutBasePath} breadcrumbs={breadcrumbs}>
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
                    <div className={`overflow-x-auto`}>
                      <Table<ProductInterface> columns={columns} data={chosen} testIdKey={'_id'} />
                    </div>
                    <FixedButtons>
                      <Button
                        disabled={chosen.length < 1}
                        testId={'save-shop-products'}
                        type={'submit'}
                        size={'small'}
                      >
                        Сохранить
                      </Button>

                      <Button
                        onClick={() => setStepHandler(1)}
                        testId={'back-bottom'}
                        size={'small'}
                        theme={'secondary'}
                      >
                        Назад
                      </Button>
                    </FixedButtons>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Inner>
    </ConsoleShopLayout>
  );
};
