import Button from 'components/Button';
import Currency from 'components/Currency';
import FormattedDate from 'components/FormattedDate';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Inner from 'components/Inner';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Title from 'components/Title';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { OrderInterface, OrderProductInterface } from 'db/uiInterfaces';
import { useCancelOrderProduct, useUpdateOrderProduct } from 'hooks/mutations/useOrderMutations';
import { noNaN } from 'lib/numbers';
import Image from 'next/image';
import * as React from 'react';

interface OrderProductProductInterface {
  orderProduct: OrderProductInterface;
}

const OrderProduct: React.FC<OrderProductProductInterface> = ({ orderProduct }) => {
  const [amount, setAmount] = React.useState<number>(orderProduct.amount);
  const [touched, setTouched] = React.useState<boolean>(false);

  const { showModal } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const { product, originalName, shopProduct, itemId, price, totalPrice, status, isCanceled } =
    orderProduct;
  const productImageSrc = shopProduct
    ? `${product?.mainImage}`
    : `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
  const minAmount = 1;

  const [cancelOrderProductMutation] = useCancelOrderProduct();
  const [updateOrderProductMutation] = useUpdateOrderProduct();

  React.useEffect(() => {
    if (amount !== orderProduct.amount) {
      setTouched(true);
    }
  }, [amount, orderProduct.amount]);

  return (
    <div
      className={`flex mb-4 py-8 bg-secondary rounded-lg pr-6 ${isCanceled ? 'opacity-60' : ''}`}
    >
      {/*image*/}
      <div className='flex items-center justify-center px-2 w-28 lg:w-32'>
        <div className='relative flex justify-center flex-shrink-0 w-[120px]'>
          <Image
            objectFit={'contain'}
            objectPosition={'center'}
            src={productImageSrc}
            alt={`${originalName}`}
            title={`${originalName}`}
            width={240}
            height={240}
            quality={50}
          />
        </div>
      </div>

      <div className='flex-grow'>
        <div className='grid gap-4 lg:flex lg:items-baseline lg:justify-between'>
          <div>
            <div className='text-secondary-text mb-3 text-sm'>{`Артикул: ${itemId}`}</div>
            <div className='text-lg font-bold flex-grow mb-2'>{product?.snippetTitle}</div>
            <div>
              {shopProduct ? (
                <div>
                  Доступно:
                  {` ${shopProduct.available} шт.`}
                </div>
              ) : (
                <div className='text-red-500 font-medium'>Товар магазина не найден</div>
              )}
            </div>
            {!isCanceled ? (
              <div className='mt-4 flex gap-4'>
                {/*save button*/}
                <Button
                  disabled={!touched}
                  title={'Сохранить товар'}
                  size={'small'}
                  icon={'save'}
                  circle
                  theme={'secondary-b'}
                  onClick={() => {
                    if (amount < minAmount) {
                      showErrorNotification({
                        title: `Количество не может быть ниже ${minAmount}`,
                      });
                    } else {
                      updateOrderProductMutation({
                        orderProductId: `${orderProduct._id}`,
                        amount,
                      }).catch(console.log);
                    }
                  }}
                />

                {/*delete button*/}
                <Button
                  title={'Отменить товар'}
                  size={'small'}
                  icon={'trash'}
                  circle
                  theme={'secondary'}
                  onClick={() => {
                    showModal<ConfirmModalInterface>({
                      variant: CONFIRM_MODAL,
                      props: {
                        testId: 'cancel-order-product-modal',
                        message: `Вы уверенны, что хотите отменть товар ${originalName}?`,
                        confirm: () => {
                          cancelOrderProductMutation({
                            orderProductId: `${orderProduct._id}`,
                          }).catch(console.log);
                        },
                      },
                    });
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className='flex flex-col gap-3'>
            {/*status*/}
            <div className='flex items-baseline lg:justify-end gap-2'>
              <div className='text-secondary-text'>Статус</div>
              {status ? (
                <div className='font-medium' style={status ? { color: status.color } : {}}>
                  {status.name}
                </div>
              ) : (
                <div className='text-red-500 font-medium'>Статус не найден</div>
              )}
            </div>

            {/*price*/}
            <div className='flex gap-2 lg:justify-end text-secondary-text items-baseline'>
              <span>Цена:</span>
              <Currency className='text-xl text-primary-text' value={price} />
            </div>

            {/*amount*/}
            <div className='flex gap-2 lg:justify-end text-secondary-text'>
              <div className='w-[100px]'>
                <SpinnerInput
                  name={'amount'}
                  value={amount}
                  min={minAmount}
                  max={noNaN(shopProduct?.available)}
                  testId={`cart-dropdown-product-${orderProduct.originalName}-amount`}
                  plusTestId={`cart-dropdown-product-${orderProduct.originalName}-plus`}
                  minusTestId={`cart-dropdown-product-${orderProduct.originalName}-minus`}
                  // frameClassName='w-[var(--buttonMinWidth)]'
                  size={'small'}
                  onChange={(e) => {
                    const amount = noNaN(e.target.value);
                    if (amount >= minAmount && amount <= noNaN(shopProduct?.available)) {
                      setAmount(noNaN(e.target.value));
                    }
                  }}
                />
              </div>
            </div>

            {/*total price*/}
            <div className='flex gap-2 lg:justify-end text-secondary-text items-baseline'>
              <span>Итого:</span>
              <Currency className='text-2xl text-primary-text' value={totalPrice} />
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
