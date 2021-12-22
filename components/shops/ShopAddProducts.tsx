import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ROUTE_CMS } from '../../config/common';
import { useUserContext } from '../../context/userContext';
import {
  AppContentWrapperBreadCrumbs,
  CatalogueFilterAttributeInterface,
  ConsoleRubricProductsInterface,
  ProductSummaryInterface,
  ShopInterface,
} from '../../db/uiInterfaces';
import {
  AddProductToShopInput,
  useAddManyProductsToShopMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { useReloadListener } from '../../hooks/useReloadListener';
import useValidationSchema from '../../hooks/useValidationSchema';
import ConsoleShopLayout from '../../layout/console/ConsoleShopLayout';
import { alwaysArray } from '../../lib/arrayUtils';
import { getNumWord } from '../../lib/i18n';
import { addManyProductsToShopSchema } from '../../validation/shopSchema';
import AppContentFilter from '../AppContentFilter';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import Currency from '../Currency';
import WpCheckbox from '../FormElements/Checkbox/WpCheckbox';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikRouterSearch from '../FormElements/Search/FormikRouterSearch';
import Inner from '../Inner';
import WpLink from '../Link/WpLink';
import Pager from '../Pager';
import TableRowImage from '../TableRowImage';
import WpTable, { WpTableColumn } from '../WpTable';

export type ShopAddProductsStepType = 1 | 2;
export type ShopAddProductsCreateChosenProduct = (product: ProductSummaryInterface) => void;
export type ShopAddProductsDeleteChosenProduct = (product: ProductSummaryInterface) => void;
export type ShopAddProductsSetStepHandler = (step: ShopAddProductsStepType) => void;

export interface ShopAddProductsListInterface extends ConsoleRubricProductsInterface {
  shop: ShopInterface;
  chosen: ProductSummaryInterface[];
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
}) => {
  useReloadListener();
  const { sessionUser } = useUserContext();

  const columns: WpTableColumn<ProductSummaryInterface>[] = [
    {
      render: ({ dataItem, rowIndex }) => {
        const isSelected = chosen.find(({ _id }) => {
          return _id === dataItem._id;
        });

        return (
          <WpCheckbox
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
        return sessionUser?.role?.isStaff ? (
          <WpLink
            href={`${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`}
            target={'_blank'}
          >
            {dataItem.itemId}
          </WpLink>
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
      headTitle: 'Цены на сайте',
      render: ({ dataItem }) => {
        return (
          <div className='flex flex-col gap-2'>
            <div className='flex gap-3 justify-between'>
              <span>Мин.</span>
              <Currency value={dataItem.minPrice} />
            </div>
            <div className='flex gap-3 justify-between'>
              <span>Макс.</span>
              <Currency value={dataItem.maxPrice} />
            </div>
          </div>
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
    {
      isHidden: !sessionUser?.role?.isStaff,
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать товар'}
              updateHandler={() => {
                if (sessionUser?.role?.isStaff) {
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
              basePath={basePath}
              rubricSlug={rubricSlug}
              attributes={attributes}
              excludedParams={[rubricId]}
              selectedAttributes={selectedAttributes}
              clearSlug={clearSlug}
            />
          </div>

          <div className={'max-w-full'}>
            <div className={`overflow-x-auto`}>
              <WpTable<ProductSummaryInterface>
                columns={columns}
                data={docs}
                testIdKey={'_id'}
                onRowDoubleClick={(dataItem) => {
                  if (sessionUser?.role?.isStaff) {
                    window.open(
                      `${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`,
                      '_blank',
                    );
                  }
                }}
              />
            </div>
            <FixedButtons>
              <WpButton
                frameClassName={'w-auto'}
                disabled={chosen.length < 1}
                onClick={() => setStepHandler(2)}
                testId={'next-step'}
                size={'small'}
              >
                Далее
              </WpButton>
            </FixedButtons>

            <Pager page={page} totalPages={totalPages} />
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

  const columns: WpTableColumn<ProductSummaryInterface>[] = [
    {
      render: ({ dataItem }) => {
        const isSelected = chosen.find(({ _id }) => {
          return _id === dataItem._id;
        });

        return (
          <WpCheckbox
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
      headTitle: 'Цены на сайте',
      render: ({ dataItem }) => {
        return (
          <div className='flex flex-col gap-2'>
            <div className='flex gap-3 justify-between'>
              <span>Мин.</span>
              <Currency value={dataItem.minPrice} />
            </div>
            <div className='flex gap-3 justify-between'>
              <span>Макс.</span>
              <Currency value={dataItem.maxPrice} />
            </div>
          </div>
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
                      <WpTable<ProductSummaryInterface>
                        columns={columns}
                        data={chosen}
                        testIdKey={'_id'}
                      />
                    </div>
                    <FixedButtons>
                      <WpButton
                        frameClassName={'w-auto'}
                        disabled={chosen.length < 1}
                        testId={'save-shop-products'}
                        type={'submit'}
                        size={'small'}
                      >
                        Сохранить
                      </WpButton>

                      <WpButton
                        frameClassName={'w-auto'}
                        onClick={() => setStepHandler(1)}
                        testId={'back-bottom'}
                        size={'small'}
                        theme={'secondary'}
                      >
                        Назад
                      </WpButton>
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
