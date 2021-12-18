import WpButton from 'components/button/WpButton';
import ContentItemControls from 'components/button/ContentItemControls';
import Currency from 'components/Currency';
import FormikBarcodeInput from 'components/FormElements/FormikBarcodeInput/FormikBarcodeInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import InputLine from 'components/FormElements/Input/InputLine';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { ShopProductSupplierModalInterface } from 'components/Modal/ShopProductSupplierModal';
import Percent from 'components/Percent';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { getConstantTranslation } from 'config/constantTranslations';
import { CONFIRM_MODAL, SHOP_PRODUCT_SUPPLIER_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import { ShopProductInterface, SupplierProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useDeleteShopProductSupplierMutation } from 'generated/apolloComponents';
import { useUpdateManyShopProducts } from 'hooks/mutations/useShopProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import { updateManyShopProductsSchema } from 'validation/shopSchema';

export interface CompanyProductSuppliersInterface {
  shopProduct: ShopProductInterface;
  suppliers: SelectOptionInterface[];
  disableAddSupplier: boolean;
  routeBasePath: string;
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
      headTitle: 'Название',
      accessor: 'supplier.name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Тип формирования цены',
      accessor: 'variant',
      render: ({ cellData }) =>
        getConstantTranslation(`suppliers.priceVariant.${cellData}.${locale}`),
    },
    {
      headTitle: 'Цена',
      accessor: 'price',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      headTitle: 'Процент',
      accessor: 'percent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: 'Рекоммендованная цена',
      accessor: 'recommendedPrice',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.supplier?.name}`}
              deleteTitle={'Удалить поставщика'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-shop-product-supplier-modal',
                    message: `Вы уверенны, что хотите удалить поствщика ${dataItem.supplier?.name}?`,
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
              updateTitle={'Редактировать поставщика'}
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
                <div className='md:grid gap-8 grid-cols-2'>
                  <FormikInput
                    label={'Наличие'}
                    testId={`available`}
                    name={`.available`}
                    type={'number'}
                    min={0}
                  />

                  <FormikInput
                    label={'Цена'}
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
                        label={index === 0 ? 'Штрих-код' : undefined}
                        name={`barcode[${index}]`}
                        testId={'barcode'}
                        key={index}
                        onClear={() => {
                          showModal<ConfirmModalInterface>({
                            variant: CONFIRM_MODAL,
                            props: {
                              message: `Вы уверенны, что хотите удалить штрих-код ${barcodeItem}`,
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
                      Добавить штрих-код
                    </WpButton>
                  </div>
                </InputLine>

                <WpButton size={'small'} type={'submit'}>
                  Сохранить
                </WpButton>
              </Form>
            );
          }}
        </Formik>
      </div>

      {/*suppliers list*/}
      <div className='mb-16'>
        <div className='overflow-x-auto overflow-y-hidden mb-8'>
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
          Добавить поставщика
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
                        label={index === 0 ? 'Штрих-код' : undefined}
                        name={`barcode[${index}]`}
                        testId={'barcode'}
                        key={index}
                        onClear={() => {
                          showModal<ConfirmModalInterface>({
                            variant: CONFIRM_MODAL,
                            props: {
                              message: `Вы уверенны, что хотите удалить штрих-код ${barcodeItem}`,
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
                      Добавить штрих-код
                    </Button>
                  </div>
                </InputLine>

                <Button size={'small'} type={'submit'}>
                  Сохранить
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
