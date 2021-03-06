import { useUserContext } from 'components/context/userContext';
import { ShopProductModel } from 'db/dbModels';
import {
  ShopProductInterface,
  ShopRubricProductsInterface,
  SupplierProductInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useDeleteProductFromShopMutation } from 'generated/apolloComponents';
import { useUpdateManyShopProducts } from 'hooks/mutations/useShopProductMutations';
import { useBasePath } from 'hooks/useBasePath';
import { alwaysArray } from 'lib/arrayUtils';
import { ROLE_SLUG_ADMIN } from 'lib/config/common';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updateManyShopProductsSchema } from 'validation/shopSchema';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import AppContentFilter from '../AppContentFilter';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import Currency from '../Currency';
import FormattedDateTime from '../FormattedDateTime';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikRouterSearch from '../FormElements/Search/FormikRouterSearch';
import Inner from '../Inner';
import ConsoleShopLayout from '../layout/console/ConsoleShopLayout';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import Pager from '../Pager';
import TableRowImage from '../TableRowImage';
import WpTable, { WpTableColumn } from '../WpTable';
import ProductsListSuppliersList from './ProductsListSuppliersList';

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
  rubricSlug,
  breadcrumbs,
  currency,
}) => {
  const { sessionUser } = useUserContext();
  const router = useRouter();
  const basePath = useBasePath('rubricSlug');
  const withProducts = docs.length > 0;
  const { showModal, onErrorCallback, onCompleteCallback, showLoading, showErrorNotification } =
    useMutationCallbacks({ withModal: true, reload: true });
  const validationSchema = useValidationSchema({
    schema: updateManyShopProductsSchema,
  });

  const [updateManyShopProductsMutation] = useUpdateManyShopProducts();
  const [deleteProductFromShopMutation] = useDeleteProductFromShopMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromShop),
    onError: onErrorCallback,
  });

  const columns: WpTableColumn<ShopProductInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: '??????',
      render: ({ dataItem }) => {
        return (
          <WpLink href={`${basePath}/products/product/${dataItem._id}`} target={'_blank'}>
            {dataItem.summary?.itemId}
          </WpLink>
        );
      },
    },
    {
      headTitle: '????????',
      render: ({ dataItem }) => {
        return (
          <TableRowImage
            testId={'shop-product-main-image'}
            src={`${dataItem.summary?.mainImage}`}
            alt={`${dataItem.summary?.snippetTitle}`}
            title={`${dataItem.summary?.snippetTitle}`}
          />
        );
      },
    },
    {
      accessor: 'summary.snippetTitle',
      headTitle: '????????????????',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: '??????????????',
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
      headTitle: '????????',
      render: ({ rowIndex }) => {
        return (
          <div className='flex w-[120px] items-center gap-3' data-cy={`${rowIndex}-price`}>
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
      headTitle: '???????? ???? ??????????',
      render: ({ dataItem }) => {
        return (
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between gap-3'>
              <span>??????.</span>
              <Currency value={dataItem.minPrice} />
            </div>
            <div className='flex justify-between gap-3'>
              <span>????????.</span>
              <Currency value={dataItem.maxPrice} />
            </div>
          </div>
        );
      },
    },
    {
      accessor: 'supplierProducts',
      headTitle: '??????????????????????????????',
      render: ({ cellData }) => {
        const supplierProducts = (cellData || []) as SupplierProductInterface[];
        return <ProductsListSuppliersList supplierProducts={supplierProducts} />;
      },
    },
    {
      accessor: 'barcode',
      headTitle: '??????????-??????',
      render: ({ cellData }) => {
        const barcode = alwaysArray(cellData);
        return barcode.map((barcodeItem) => {
          return <div key={barcodeItem}>{barcodeItem}</div>;
        });
      },
    },
    {
      accessor: 'lastSyncedAt',
      headTitle: '?????????????????? ??????????????????????????',
      render: ({ cellData }) => <FormattedDateTime value={cellData} />,
    },
    {
      render: ({ dataItem, rowIndex }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            testId={`shop-product-${rowIndex}`}
            updateTitle={'?????????????????????????? ??????????'}
            updateHandler={() => {
              window.open(`${basePath}/products/product/${dataItem._id}`, '_blank');
            }}
            deleteTitle={'?????????????? ?????????? ???? ????????????????'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: `delete-shop-product-modal`,
                  message: `???? ????????????????, ?????? ???????????? ?????????????? ${dataItem.summary?.snippetTitle} ???? ?????????????????`,
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
      '????????????????????????',
      '????????????????????????',
      '????????????????????????',
    ]);
    return `?????????????? ${noNaN(totalDocs)} ${catalogueCounterPostfix}`;
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
    <ConsoleShopLayout shop={shop} breadcrumbs={breadcrumbs}>
      <Inner testId={`shop-rubric-products-list`}>
        <div className={`mb-2 text-3xl font-medium`}>{rubricName}</div>
        <div className={`mb-6`}>{catalogueCounterString}</div>
        {sessionUser?.role?.slug === ROLE_SLUG_ADMIN ? (
          <div className={`mb-6`}>
            <WpButton
              theme={'secondary'}
              size={'small'}
              onClick={() => {
                const filters = alwaysArray(router.query.filters).join('/');
                window.open(
                  `/api/xlsx/shop-products/${shop._id}/${router.query.rubricSlug}/${filters}`,
                  '_blank',
                );
              }}
            >
              ?????????????????? ?? XLS
            </WpButton>
          </div>
        ) : null}

        <FormikRouterSearch testId={'products'} />

        <div className={`max-w-full`}>
          {withProducts ? (
            <div className={'mb-8'}>
              <AppContentFilter
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
                    title: '?????? ???????????????????? ??????????????',
                  });
                }
              }}
            >
              {() => {
                return (
                  <Form>
                    <div className={`overflow-x-auto`}>
                      <WpTable<ShopProductInterface>
                        columns={columns}
                        data={docs}
                        testIdKey={'_id'}
                        onRowDoubleClick={(dataItem) => {
                          if (sessionUser?.role?.isStaff) {
                            window.open(`${basePath}/products/product/${dataItem._id}`, '_blank');
                          }
                        }}
                      />
                    </div>
                    <FixedButtons>
                      {withProducts ? (
                        <WpButton
                          frameClassName='w-auto'
                          testId={'save-shop-products'}
                          type={'submit'}
                          size={'small'}
                        >
                          ??????????????????
                        </WpButton>
                      ) : null}

                      <WpButton
                        frameClassName='w-auto'
                        onClick={() => {
                          router.push(`${basePath}/add`).catch(console.log);
                        }}
                        testId={'add-shop-product'}
                        size={'small'}
                      >
                        ???????????????? ????????????
                      </WpButton>
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
