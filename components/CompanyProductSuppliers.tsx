import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls';
import Currency from 'components/Currency';
import FixedButtons from 'components/FixedButtons';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { ShopProductSupplierModalInterface } from 'components/Modal/ShopProductSupplierModal';
import Percent from 'components/Percent';
import Table, { TableColumn } from 'components/Table';
import { getConstantTranslation } from 'config/constantTranslations';
import { CONFIRM_MODAL, SHOP_PRODUCT_SUPPLIER_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import { ShopProductInterface, SupplierProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  useDeleteShopProductSupplierMutation,
  useUpdateManyShopProductsMutation,
} from 'generated/apolloComponents';
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

  const [updateManyShopProductsMutation] = useUpdateManyShopProductsMutation({
    onCompleted: (data) => onCompleteCallback(data.updateManyShopProducts),
    onError: onErrorCallback,
  });
  const validationSchema = useValidationSchema({
    schema: updateManyShopProductsSchema,
  });

  const columns: TableColumn<SupplierProductInterface>[] = [
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
    input: [
      {
        productId: shopProduct.productId,
        shopProductId: shopProduct._id,
        price: noNaN(shopProduct.price),
        available: noNaN(shopProduct.available),
      },
    ],
  };

  return (
    <Inner testId={'shop-product-suppliers-list'}>
      <div className='mb-16'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            showLoading();
            updateManyShopProductsMutation({
              variables: values,
            }).catch((e) => console.log(e));
          }}
        >
          {() => {
            return (
              <Form>
                <FormikInput
                  label={'Цена'}
                  testId={`price`}
                  name={`input[0].price`}
                  type={'number'}
                  min={0}
                />

                <FormikInput
                  label={'Наличие'}
                  testId={`available`}
                  name={`input[0].available`}
                  type={'number'}
                  min={0}
                />

                <Button size={'small'} type={'submit'}>
                  Сохранить
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>

      <div className='overflow-x-auto overflow-y-hidden'>
        <Table<SupplierProductInterface>
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
      <FixedButtons>
        <Button
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
        </Button>
      </FixedButtons>
    </Inner>
  );
};

export default CompanyProductSuppliers;
