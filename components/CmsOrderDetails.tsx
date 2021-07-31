import Currency from 'components/Currency';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import ProductShopPrices from 'components/ProductShopPrices';
import Title from 'components/Title';
import { OrderInterface, OrderProductInterface } from 'db/uiInterfaces';
import Image from 'next/image';
import * as React from 'react';

interface OrderProductProductInterface {
  orderProduct: OrderProductInterface;
}

const OrderProduct: React.FC<OrderProductProductInterface> = ({ orderProduct }) => {
  const { originalName, shopProduct, itemId, price, amount, totalPrice } = orderProduct;
  const productImageSrc = shopProduct
    ? shopProduct.mainImage
    : `${process.env.OBJECT_STORAGE_PRODUCT_IMAGE_FALLBACK}`;
  const imageWidth = 35;
  const imageHeight = 120;

  return (
    <div className='flex mb-4 py-8 bg-secondary rounded-lg pr-6'>
      <div className='flex items-center justify-center px-4 w-20 lg:w-28'>
        <Image
          src={productImageSrc}
          alt={`${originalName}`}
          title={`${originalName}`}
          width={imageWidth}
          height={imageHeight}
        />
      </div>

      <div className='flex-grow'>
        <div className='text-secondary-text mb-3 text-sm'>{`Артикул: ${itemId}`}</div>

        <div className='grid gap-4 lg:flex lg:items-baseline lg:justify-between'>
          <div>
            <div className='text-lg font-bold flex-grow mb-4'>{originalName}</div>
            <div>
              {shopProduct ? (
                <div>
                  Доступно:
                  {` ${shopProduct.available}`}
                </div>
              ) : (
                <div className='text-red-500 font-medium'>Товар магазина не найден</div>
              )}
            </div>
          </div>

          <div>
            <div className='flex items-baseline ml-auto flex-grow-0'>
              <ProductShopPrices className='text-lg font-bold' price={price} size={'small'} />
              <Icon name={'cross'} className='w-2 h-2 mx-4' />
              <div className='font-medium'>{amount}</div>
            </div>
            <div className='flex gap-2 lg:justify-end text-secondary-text'>
              <span>Итого:</span>
              <Currency value={totalPrice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CmsOrderDetailsInterface {
  order: OrderInterface;
  title: string;
}

const CmsOrderDetails: React.FC<CmsOrderDetailsInterface> = ({ order, title }) => {
  const { createdAt, totalPrice, status, products, shop, customer, comment } = order;

  return (
    <Inner testId={`order-details`}>
      <div className='grid gap-4 md:flex justify-between items-baseline mb-12'>
        <div>
          <Title low>{title}</Title>
          <div className='text-secondary-text'>
            от <FormattedDate value={createdAt} />
          </div>
        </div>
      </div>

      <div className='md:grid grid-cols-9 gap-8'>
        <div className='col-span-6'>
          {products?.map((orderProduct) => {
            return <OrderProduct orderProduct={orderProduct} key={`${orderProduct._id}`} />;
          })}
        </div>

        <div className='relative col-span-3'>
          <div className='sticky bg-secondary rounded-lg py-8 px-6'>
            {/*status*/}
            <div className='flex items-baseline justify-between mb-6'>
              <div className='text-secondary-text'>Статус</div>
              {status ? (
                <div className='font-medium' style={status ? { color: status.color } : {}}>
                  {status.name}
                </div>
              ) : (
                <div className='text-red-500 font-medium'>Статус не найден</div>
              )}
            </div>

            {/*customer*/}
            <div className='mb-6'>
              <div className='text-secondary-text mb-3'>Заказчик:</div>
              {customer ? (
                <div className='space-y-2'>
                  <div className='font-medium'>{customer?.fullName}</div>
                  <div className='font-medium text-secondary-text'>
                    <LinkEmail value={customer.email} />
                  </div>
                  <div className='font-medium text-secondary-text'>
                    <LinkPhone value={customer.formattedPhone} />
                  </div>
                </div>
              ) : (
                <div className='text-red-500 font-medium'>Заказчик не найден</div>
              )}
            </div>

            {/*comment*/}
            {comment && comment.length > 0 ? (
              <div className='mb-6'>
                <div className='text-secondary-text mb-3'>Комментарий заказчика:</div>
                <div className='prose'>{comment}</div>
              </div>
            ) : null}

            {/*shop info*/}
            <div className='mb-6'>
              <div className='text-secondary-text mb-3'>Магазин:</div>

              {shop ? (
                <div className='space-y-2'>
                  <span className='text-primary-text font-medium'>{shop.name}</span>
                  <div className='text-secondary-text'>{shop.address.formattedAddress}</div>
                </div>
              ) : (
                <div className='text-red-500 font-medium'>Магазин не найден</div>
              )}
            </div>

            <div className='flex flex-wrap gap-2 items-baseline'>
              <div className='text-secondary-text'>Итого:</div>
              <Currency className='text-2xl' valueClassName='font-medium' value={totalPrice} />
            </div>
          </div>
        </div>
      </div>
    </Inner>
  );
};

export default CmsOrderDetails;
