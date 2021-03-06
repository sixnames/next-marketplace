import { ShopProductInterface, SupplierProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useDeleteShopProductSupplierMutation } from 'generated/apolloComponents';
import { useUpdateManyShopProducts } from 'hooks/mutations/useShopProductMutations';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { CONFIRM_MODAL, SHOP_PRODUCT_SUPPLIER_MODAL } from 'lib/config/modalVariants';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import { updateManyShopProductsSchema } from 'validation/shopSchema';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import ContentItemControls from '../button/ContentItemControls';
import WpButton from '../button/WpButton';
import { useLocaleContext } from '../context/localeContext';
import Currency from '../Currency';
import FormikBarcodeInput from '../FormElements/FormikBarcodeInput/FormikBarcodeInput';
import FormikInput from '../FormElements/Input/FormikInput';
import InputLine from '../FormElements/Input/InputLine';
import { SelectOptionInterface } from '../FormElements/Select/Select';
import Inner from '../Inner';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import { ShopProductSupplierModalInterface } from '../Modal/ShopProductSupplierModal';
import Percent from '../Percent';
import WpTable, { WpTableColumn } from '../WpTable';

export interface CompanyProductSuppliersInterface {
  shopProduct: ShopProductInterface;
  suppliers: SelectOptionInterface[];
  disableAddSupplier: boolean;
}

const CompanyProductSuppliers: React.FC<CompanyProductSuppliersInterface> = ({
  suppliers,
  shopProduct,
  disableAddSupplier,
}) => {
  const { locale } = useLocaleContext();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [deleteShopProductSupplierMutation] = useDeleteShopProductSupplierMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteShopProductSupplier),
    onError: onErrorCallback,
  });

  const [updateManyShopProductsMutation] = useUpdateManyShopProducts();
  const validationSchema = useValidationSchema({
    schema: updateManyShopProductsSchema,
  });

  const columns: WpTableColumn<SupplierProductInterface>[] = [
    {
      headTitle: '????????????????',
      accessor: 'supplier.name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: '?????? ???????????????????????? ????????',
      accessor: 'variant',
      render: ({ cellData }) =>
        getConstantTranslation(`suppliers.priceVariant.${cellData}.${locale}`),
    },
    {
      headTitle: '????????',
      accessor: 'price',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      headTitle: '??????????????',
      accessor: 'percent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: '???????????????????????????????? ????????',
      accessor: 'recommendedPrice',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.supplier?.name}`}
              deleteTitle={'?????????????? ????????????????????'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-shop-product-supplier-modal',
                    message: `???? ????????????????, ?????? ???????????? ?????????????? ?????????????????? ${dataItem.supplier?.name}?`,
                    confirm: () => {
                      showLoading();
                      deleteShopProductSupplierMutation({
                        variables: {
                          _id: dataItem._id,
                        },
                      }).catch(console.log);
                    },
                  },
                });
              }}
              updateTitle={'?????????????????????????? ????????????????????'}
              updateHandler={() => {
                showModal<ShopProductSupplierModalInterface>({
                  variant: SHOP_PRODUCT_SUPPLIER_MODAL,
                  props: {
                    suppliers,
                    supplierProduct: dataItem,
                    shopProduct,
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  const initialValues = {
    productId: shopProduct.productId,
    shopProductId: shopProduct._id,
    price: noNaN(shopProduct.price),
    available: noNaN(shopProduct.available),
    barcode: shopProduct.barcode || [''],
  };

  return (
    <Inner testId={'shop-product-suppliers-list'}>
      {/*price and availability*/}
      <div className='mb-16'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            updateManyShopProductsMutation([
              {
                barcode: values.barcode,
                price: values.price,
                available: values.available,
                shopProductId: `${values.shopProductId}`,
              },
            ]).catch((e) => console.log(e));
          }}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form>
                <div className='grid-cols-2 gap-8 md:grid'>
                  <FormikInput
                    label={'??????????????'}
                    testId={`available`}
                    name={`.available`}
                    type={'number'}
                    min={0}
                  />

                  <FormikInput
                    label={'????????'}
                    testId={`price`}
                    name={`.price`}
                    type={'number'}
                    min={0}
                  />
                </div>

                <InputLine labelTag={'div'}>
                  {values.barcode.map((barcodeItem, index) => {
                    return (
                      <FormikBarcodeInput
                        label={index === 0 ? '??????????-??????' : undefined}
                        name={`barcode[${index}]`}
                        testId={'barcode'}
                        key={index}
                        onClear={() => {
                          showModal<ConfirmModalInterface>({
                            variant: CONFIRM_MODAL,
                            props: {
                              message: `???? ????????????????, ?????? ???????????? ?????????????? ??????????-?????? ${barcodeItem}`,
                              confirm: () => {
                                const barcodesCopy = [...values.barcode];
                                const updatedBarcodesList = barcodesCopy.filter(
                                  (_item, itemIndex) => {
                                    return itemIndex !== index;
                                  },
                                );
                                setFieldValue(`barcode`, updatedBarcodesList);
                              },
                            },
                          });
                        }}
                      />
                    );
                  })}
                  <div>
                    <WpButton
                      theme={'secondary'}
                      size={'small'}
                      onClick={() => {
                        setFieldValue('barcode', [...values.barcode, '']);
                      }}
                    >
                      ???????????????? ??????????-??????
                    </WpButton>
                  </div>
                </InputLine>

                <WpButton size={'small'} type={'submit'}>
                  ??????????????????
                </WpButton>
              </Form>
            );
          }}
        </Formik>
      </div>

      {/*suppliers list*/}
      <div className='mb-16'>
        <div className='mb-8 overflow-x-auto overflow-y-hidden'>
          <WpTable<SupplierProductInterface>
            columns={columns}
            data={shopProduct.supplierProducts}
            testIdKey={'supplier.name'}
            onRowDoubleClick={(dataItem) => {
              showModal<ShopProductSupplierModalInterface>({
                variant: SHOP_PRODUCT_SUPPLIER_MODAL,
                props: {
                  suppliers,
                  supplierProduct: dataItem,
                  shopProduct,
                },
              });
            }}
          />
        </div>
        <WpButton
          disabled={disableAddSupplier}
          testId={'add-supplier'}
          size={'small'}
          onClick={() => {
            showModal<ShopProductSupplierModalInterface>({
              variant: SHOP_PRODUCT_SUPPLIER_MODAL,
              props: {
                suppliers,
                shopProduct,
              },
            });
          }}
        >
          ???????????????? ????????????????????
        </WpButton>
      </div>

      {/*barcode*/}
      {/*<div className='mb-16'>
        <Formik
          initialValues={{ barcode }}
          onSubmit={(values) => {
            showLoading();
            updateShopProductBarcodeMutation({
              variables: {
                input: {
                  shopProductId: shopProduct._id,
                  barcode: values.barcode.filter((barcodeItem) => Boolean(barcodeItem)),
                },
              },
            }).catch((e) => console.log(e));
          }}
        >
          {({ setFieldValue, values }) => {
            return (
              <Form>
                <InputLine labelTag={'div'}>
                  {values.barcode.map((barcodeItem, index) => {
                    return (
                      <FormikBarcodeInput
                        label={index === 0 ? '??????????-??????' : undefined}
                        name={`barcode[${index}]`}
                        testId={'barcode'}
                        key={index}
                        onClear={() => {
                          showModal<ConfirmModalInterface>({
                            variant: CONFIRM_MODAL,
                            props: {
                              message: `???? ????????????????, ?????? ???????????? ?????????????? ??????????-?????? ${barcodeItem}`,
                              confirm: () => {
                                const barcodesCopy = [...values.barcode];
                                const updatedBarcodesList = barcodesCopy.filter(
                                  (_item, itemIndex) => {
                                    return itemIndex !== index;
                                  },
                                );
                                setFieldValue(`barcode`, updatedBarcodesList);
                              },
                            },
                          });
                        }}
                      />
                    );
                  })}
                  <div>
                    <Button
                      onClick={() => {
                        setFieldValue('barcode', [...values.barcode, '']);
                      }}
                      theme={'secondary'}
                      size={'small'}
                    >
                      ???????????????? ??????????-??????
                    </Button>
                  </div>
                </InputLine>

                <Button size={'small'} type={'submit'}>
                  ??????????????????
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>*/}
    </Inner>
  );
};

export default CompanyProductSuppliers;
