import * as React from 'react';
import { Form, Formik } from 'formik';
import { UpdateShopProductInputInterface } from '../../db/dao/shopProduct/updateManyShopProducts';
import { ProductInterface, ShopProductInterface } from '../../db/uiInterfaces';
import useValidationSchema from '../../hooks/useValidationSchema';
import { noNaN } from '../../lib/numbers';
import { shopProductInModalSchema } from '../../validation/shopSchema';
import WpButton from '../button/WpButton';
import FormikInput from '../FormElements/Input/FormikInput';
import WpImage from '../WpImage';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

interface ModalShopProductInterface extends Partial<Omit<ShopProductInterface, 'product'>> {
  product?: Partial<ProductInterface> | null;
}

export interface ShopProductModalInterface {
  shopProduct: ModalShopProductInterface;
  confirm: (values: Omit<UpdateShopProductInputInterface, 'shopProductId'>) => void;
  title: string;
}

const ShopProductModal: React.FC<ShopProductModalInterface> = ({ shopProduct, title, confirm }) => {
  const { available, price, product } = shopProduct;
  const validationSchema = useValidationSchema({
    schema: shopProductInModalSchema,
  });

  const initialValues = {
    productId: `${product?._id}`,
    available: noNaN(available),
    price: noNaN(price),
  };

  return (
    <ModalFrame testId={'update-shop-product-modal'}>
      <ModalTitle>{title}</ModalTitle>
      <div className='flex gap-4'>
        <div className='w-28 flex-shrink-0'>
          <div className='relative pb-[100%] w-full'>
            <WpImage
              url={`${product?.mainImage}`}
              alt={`${product?.name}`}
              title={`${product?.name}`}
              width={100}
              className='absolute inset-0 w-full h-full object-contain'
            />
          </div>
        </div>
        <div className='font-medium text-lg'>{product?.name}</div>
      </div>
      <div className='flex-grow'>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            confirm({
              available: values.available,
              price: values.price,
              barcode: [],
            });
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

                <WpButton testId={'shop-submit'} type={'submit'}>
                  Сохранить
                </WpButton>
              </Form>
            );
          }}
        </Formik>
      </div>
    </ModalFrame>
  );
};

export default ShopProductModal;
