import { ProductInterface, ShopProductInterface } from 'db/uiInterfaces';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import { UpdateShopProductInput } from 'generated/apolloComponents';
import { Form, Formik } from 'formik';
import useValidationSchema from '../../../hooks/useValidationSchema';
import FormikInput from '../../FormElements/Input/FormikInput';
import Button from '../../Buttons/Button';
import Image from 'next/image';
import { shopProductInModalSchema } from 'validation/shopSchema';

interface ModalShopProductInterface extends Partial<Omit<ShopProductInterface, 'product'>> {
  product?: Partial<ProductInterface> | null;
}

export interface ShopProductModalInterface {
  shopProduct: ModalShopProductInterface;
  confirm: (values: Omit<UpdateShopProductInput, 'productId' | 'shopProductId'>) => void;
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
          <Image
            src={`${product?.mainImage}`}
            alt={`${product?.name}`}
            title={`${product?.name}`}
            objectFit={'contain'}
            width={100}
            height={100}
          />
        </div>
        <div className='font-medium text-lg'>{product?.name}</div>
      </div>
      <div className='flex-grow'>
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
      </div>
    </ModalFrame>
  );
};

export default ShopProductModal;
