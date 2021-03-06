import { Form, Formik } from 'formik';
import * as React from 'react';
import { ShopProductInterface, SupplierProductInterface } from '../../db/uiInterfaces';
import {
  AddShopProductSupplierInput,
  useAddShopProductSupplierMutation,
  useUpdateShopProductSupplierMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { SUPPLIER_PRICE_VARIANT_CHARGE } from '../../lib/config/common';
import {
  getConstantOptions,
  SUPPLIER_PRICE_VARIANT_OPTIONS,
} from '../../lib/config/constantSelects';
import WpButton from '../button/WpButton';
import { useLocaleContext } from '../context/localeContext';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import { SelectOptionInterface } from '../FormElements/Select/Select';
import ModalFrame from './ModalFrame';
import ModalText from './ModalText';
import ModalTitle from './ModalTitle';

export interface ShopProductSupplierModalInterface {
  shopProduct: ShopProductInterface;
  supplierProduct?: SupplierProductInterface;
  suppliers: SelectOptionInterface[];
}

const ShopProductSupplierModal: React.FC<ShopProductSupplierModalInterface> = ({
  shopProduct,
  suppliers,
  supplierProduct,
}) => {
  const { locale } = useLocaleContext();
  const { onCompleteCallback, onErrorCallback, showLoading, showErrorNotification } =
    useMutationCallbacks({
      reload: true,
    });
  const [addShopProductSupplierMutation] = useAddShopProductSupplierMutation({
    onCompleted: (data) => onCompleteCallback(data.addShopProductSupplier),
    onError: onErrorCallback,
  });
  const [updateShopProductSupplierMutation] = useUpdateShopProductSupplierMutation({
    onCompleted: (data) => onCompleteCallback(data.updateShopProductSupplier),
    onError: onErrorCallback,
  });

  if (suppliers.length < 1) {
    return (
      <ModalFrame testId={'shop-product-supplier-modal'}>
        <ModalTitle>Добавление поставщика</ModalTitle>
        <ModalText>Использованны высе доступные поставщики</ModalText>
      </ModalFrame>
    );
  }

  const initialValues: AddShopProductSupplierInput = {
    percent: supplierProduct?.percent || 0,
    price: supplierProduct?.price || 0,
    shopProductId: shopProduct._id,
    supplierId: supplierProduct?.supplierId || '',
    variant: supplierProduct?.variant || (SUPPLIER_PRICE_VARIANT_CHARGE as any),
  };

  return (
    <ModalFrame testId={'shop-product-supplier-modal'}>
      <ModalTitle>{supplierProduct ? 'Обновление' : 'Добавление'} поставщика</ModalTitle>
      <Formik<AddShopProductSupplierInput>
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values) => {
          if (!values.supplierId) {
            showErrorNotification({
              message: 'Выберите поставщика',
            });
            return;
          }

          showLoading();
          if (supplierProduct) {
            updateShopProductSupplierMutation({
              variables: {
                input: {
                  supplierProductId: supplierProduct._id,
                  percent: values.percent,
                  price: values.price,
                  variant: values.variant,
                },
              },
            }).catch(console.log);
            return;
          }

          addShopProductSupplierMutation({
            variables: {
              input: values,
            },
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikSelect
                disabled={Boolean(supplierProduct)}
                label={'Поставщик'}
                testId={'supplierId'}
                name={'supplierId'}
                firstOption={true}
                options={suppliers}
                isRequired
                showInlineError
                useIdField
              />

              <FormikSelect
                label={'Тип формирования цены\t'}
                testId={'variant'}
                name={'variant'}
                options={getConstantOptions(SUPPLIER_PRICE_VARIANT_OPTIONS, locale)}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Цена'}
                name={'price'}
                testId={'supplier-price'}
                type={'number'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Процент'}
                name={'percent'}
                testId={'supplier-percent'}
                type={'number'}
                isRequired
                showInlineError
              />

              <WpButton type={'submit'} testId={'submit-supplier-product'}>
                {supplierProduct ? 'Обновить' : 'Добавить'}
              </WpButton>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default ShopProductSupplierModal;
