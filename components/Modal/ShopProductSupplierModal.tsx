import Button from 'components/Button';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import ModalText from 'components/Modal/ModalText';
import { SUPPLIER_PRICE_VARIANT_CHARGE } from 'config/common';
import { ShopProductInterface, SupplierInterface } from 'db/uiInterfaces';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import {
  AddShopProductSupplierInput,
  useAddShopProductSupplierMutation,
} from 'generated/apolloComponents';
import { Form, Formik } from 'formik';

export interface ShopProductSupplierModalInterface {
  shopProduct: ShopProductInterface;
  suppliers: SupplierInterface[];
}

const ShopProductSupplierModal: React.FC<ShopProductSupplierModalInterface> = ({
  shopProduct,
  suppliers,
}) => {
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [addShopProductSupplierMutation] = useAddShopProductSupplierMutation({
    onCompleted: (data) => onCompleteCallback(data.addShopProductSupplier),
    onError: onErrorCallback,
  });

  if (suppliers.length < 1) {
    return (
      <ModalFrame testId={'add-shop-product-supplier-modal'}>
        <ModalTitle>Добавление поставщика</ModalTitle>
        <ModalText>Использованны высе доступные поставщики</ModalText>
      </ModalFrame>
    );
  }

  const initialValues: AddShopProductSupplierInput = {
    percent: 0,
    price: 0,
    shopProductId: shopProduct._id,
    supplierId: '',
    variant: SUPPLIER_PRICE_VARIANT_CHARGE as any,
  };

  console.log(suppliers);

  return (
    <ModalFrame testId={'add-shop-product-supplier-modal'}>
      <ModalTitle>Добавление поставщика</ModalTitle>
      <Formik<AddShopProductSupplierInput>
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
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
                label={'Поставщик'}
                testId={'supplierId'}
                name={'supplierId'}
                options={suppliers}
                isRequired
                showInlineError
              />
              <Button type={'submit'} testId={'submit-supplier-product'}>
                Добавить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default ShopProductSupplierModal;
