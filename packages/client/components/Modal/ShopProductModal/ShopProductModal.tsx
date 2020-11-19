import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import { ShopProductFragment, UpdateShopProductInput } from '../../../generated/apolloComponents';
import { Form, Formik } from 'formik';
import useValidationSchema from '../../../hooks/useValidationSchema';
import { updateShopProductClientSchema } from '@yagu/validation';
import FormikInput from '../../FormElements/Input/FormikInput';
import Button from '../../Buttons/Button';
import classes from './ShopProductModal.module.css';
import Image from '../../Image/Image';

export interface ShopProductModalInterface {
  shopProduct: Pick<ShopProductFragment, 'product' | 'available' | 'price'>;
  confirm: (values: Omit<UpdateShopProductInput, 'productId'>) => void;
  title: string;
}

const ShopProductModal: React.FC<ShopProductModalInterface> = ({ shopProduct, title, confirm }) => {
  const { available, price, product } = shopProduct;
  const { mainImage, nameString } = product;
  const validationSchema = useValidationSchema({
    schema: updateShopProductClientSchema,
  });

  const initialValues = {
    available,
    price,
  };

  return (
    <ModalFrame testId={'update-shop-product-modal'}>
      <ModalTitle>{title}</ModalTitle>
      <div className={classes.product}>
        <div className={classes.image}>
          <Image url={mainImage} alt={nameString} title={nameString} width={100} />
        </div>
        <div className={classes.name}>{nameString}</div>
      </div>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikInput
                label={'Наличие'}
                type={'number'}
                min={0}
                name={'available'}
                testId={'available'}
                isRequired
                showInlineError
              />

              <FormikInput
                label={'Цена'}
                type={'number'}
                min={1}
                name={'price'}
                testId={'price'}
                isRequired
                showInlineError
              />

              <Button testId={'shop-submit'} type={'submit'}>
                Сохранить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default ShopProductModal;
